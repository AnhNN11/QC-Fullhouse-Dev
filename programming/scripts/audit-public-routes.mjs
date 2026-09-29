// Read-only HTTP audit. No forms, auth, API endpoints or database mutations.
const base = new URL(process.env.PUBLIC_AUDIT_ORIGIN || 'http://localhost:3000');
if (!['localhost', '127.0.0.1'].includes(base.hostname)) throw new Error('Audit is limited to localhost.');
const editorial = path => path === '/' || /^\/(about|people|programs|extracurriculars|blog|contact)(\/|$)/.test(path);
const queue = ['/'];
const seen = new Set();
const destinations = new Set();
const failures = [];
const fragments = [];
const documents = new Map();
const images = new Map();
const responsiveImages = new Map();
const checkResponsive = process.argv.includes('--responsive-images');
while (queue.length) {
  const path = queue.shift();
  if (seen.has(path)) continue;
  seen.add(path);
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(15000) });
  const html = await response.text();
  documents.set(path, html);
  if (response.status !== 200) failures.push({ path, status: response.status });
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) failures.push({ path, error: 'Expected one h1' });
  for (const [, raw] of html.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
    const source = new URL(raw.replaceAll('&amp;', '&'), base);
    if (source.origin !== base.origin) continue;
    const owners = images.get(source.href) || new Set();
    owners.add(path);
    images.set(source.href, owners);
  }
  if (checkResponsive) {
    for (const [, raw] of html.matchAll(/<img\b[^>]*\bsrcSet="([^"]+)"/gi)) {
      for (const candidate of raw.replaceAll('&amp;', '&').split(',')) {
        const [url] = candidate.trim().split(/\s+/);
        const source = new URL(url, base);
        if (source.origin !== base.origin) continue;
        const owners = responsiveImages.get(source.href) || new Set();
        owners.add(path);
        responsiveImages.set(source.href, owners);
      }
    }
  }
  for (const [, raw] of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = raw.replaceAll('&amp;', '&');
    const target = new URL(href, new URL(path, base));
    if (target.origin !== base.origin || /^\/(api|admin)(\/|$)/.test(target.pathname)) continue;
    destinations.add(target.pathname);
    if (editorial(target.pathname)) {
      if (!seen.has(target.pathname)) queue.push(target.pathname);
      if (target.hash) fragments.push({ from: path, to: target.pathname, id: decodeURIComponent(target.hash.slice(1)) });
    }
  }
}
for (const path of destinations) {
  if (seen.has(path)) continue;
  const response = await fetch(new URL(path, base), { signal: AbortSignal.timeout(15000) });
  if (response.status !== 200) failures.push({ path, status: response.status });
  await response.body?.cancel();
}
for (const { from, to, id } of fragments) {
  const html = documents.get(to);
  if (html && !html.includes(`id="${id}"`)) failures.push({ from, to, missingFragment: id });
}
for (const [url, owners] of images) {
  try {
    const response = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(15000) });
    if (response.status !== 200 || !response.headers.get('content-type')?.startsWith('image/')) {
      failures.push({ image: url, pages: [...owners], status: response.status, type: response.headers.get('content-type') });
    }
  } catch (error) {
    failures.push({ image: url, pages: [...owners], error: String(error) });
  }
}
// GET and decode real responsive outputs, rather than accepting only HEAD/200.
// Four workers bound load on the local Next.js optimizer.
if (checkResponsive) {
  const { default: sharp } = await import('sharp');
  const pending = [...responsiveImages];
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (pending.length) {
      const [url, owners] = pending.shift();
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(20000) });
        if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
          await response.body?.cancel();
          throw new Error(`Image response ${response.status}: ${response.headers.get('content-type')}`);
        }
        const bytes = Buffer.from(await response.arrayBuffer());
        const { info } = await sharp(bytes).raw().toBuffer({ resolveWithObject: true });
        if (!info.width || !info.height) throw new Error('Decoded image has no dimensions');
      } catch (error) {
        failures.push({ responsiveImage: url, pages: [...owners], error: String(error) });
      }
    }
  }));
}
console.log(JSON.stringify({ editorialPages: seen.size, internalDestinations: destinations.size, fragmentsChecked: fragments.length, imageResponsesChecked: images.size, responsiveImagesDecoded: checkResponsive ? responsiveImages.size : null, paths: [...seen].sort(), failures }, null, 2));
if (failures.length) process.exitCode = 1;
