const invalid = () => new Error("Cookie không hợp lệ. Cần sessionid không rỗng của fullhousedev.com (JSON, Netscape hoặc name=value).");

function allowedDomain(domain) {
  if (domain === undefined) return true;
  return typeof domain === "string" && domain.trim().replace(/^\./, "").toLowerCase() === "fullhousedev.com";
}

/** Convert browser exports or pasted headers without logging secret values. */
export function normalizeFullhouseCookie(input) {
  if (typeof input !== "string" || input.length > 100_000) throw invalid();
  const text = input.trim();
  let pairs;
  if (/^[\[{]/.test(text)) {
    let parsed;
    try { parsed = JSON.parse(text); } catch { throw invalid(); }
    const rows = Array.isArray(parsed) ? parsed : parsed?.cookies ?? [parsed];
    if (!Array.isArray(rows)) throw invalid();
    pairs = rows.filter((row) => row && allowedDomain(row.domain))
      .map((row) => [row.name, row.value]);
  } else if (text.includes("\t")) {
    pairs = text.split(/\r?\n/)
      .map((line) => line.replace(/^#HttpOnly_/, ""))
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => line.split("\t"))
      .filter((parts) => parts.length === 7 && allowedDomain(parts[0]))
      .map((parts) => [parts[5], parts[6]]);
  } else {
    const raw = text.replace(/^Cookie:\s*/i, "");
    if (/[\r\n]/.test(raw)) throw invalid();
    pairs = raw.split(";").filter((part) => part.trim()).map((part) => {
      const index = part.indexOf("=");
      return index < 0 ? [] : [part.slice(0, index).trim(), part.slice(index + 1).trim()];
    });
  }
  const cookies = new Map();
  for (const [name, value] of pairs) {
    if (typeof name !== "string" || !/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(name)
      || typeof value !== "string" || !/^[\x21\x23-\x2B\x2D-\x3A\x3C-\x5B\x5D-\x7E]*$/.test(value)) throw invalid();
    if (cookies.has(name) && cookies.get(name) !== value) throw invalid();
    cookies.set(name, value);
  }
  if (!cookies.get("sessionid")) throw invalid();
  return [...cookies].map(([name, value]) => `${name}=${value}`).join("; ");
}
