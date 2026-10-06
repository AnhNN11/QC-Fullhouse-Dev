import { test } from "node:test";
import assert from "node:assert/strict";
import { normalizeFullhouseCookie as normalize } from "../lib/fullhouse-cookie.mjs";

test("supports singleton, array and wrapped browser JSON", () => {
  const row = { name: "sessionid", value: "abc123xyz" };
  for (const input of [row, [row], { cookies: [{ ...row, domain: ".fullhousedev.com" }] }]) {
    assert.equal(normalize(JSON.stringify(input)), "sessionid=abc123xyz");
  }
});
test("keeps values containing equals and normalizes raw Cookie headers", () => {
  assert.equal(normalize("Cookie: sessionid=abc==; csrftoken=xyz"), "sessionid=abc==; csrftoken=xyz");
});
test("includes Netscape HttpOnly session cookies", () => {
  assert.equal(normalize("# Netscape HTTP Cookie File\n#HttpOnly_.fullhousedev.com\tTRUE\t/\tTRUE\t0\tsessionid\tabc"), "sessionid=abc");
});
test("rejects missing/empty sessions, wrong domains, malformed input and header injection", () => {
  for (const input of ["", "sessionid=", "csrftoken=abc", "{", "null", "sessionid=a\r\nX-Test: injected",
    JSON.stringify({ name: "sessionid", value: "secret; injected=x" }),
    JSON.stringify({ name: "sessionid", value: "abc", domain: "evilfullhousedev.com" }),
    JSON.stringify({ cookies: [{ name: "csrftoken", value: "abc" }] }),
    "sessionid=a; sessionid=b"]) assert.throws(() => normalize(input), /Cookie không hợp lệ/);
});
test("filters unrelated domains and never includes secrets in validation errors", () => {
  assert.equal(normalize(JSON.stringify([{name:"sessionid",value:"abc",domain:"fullhousedev.com"},
    {name:"other",value:"private",domain:"example.com"}])), "sessionid=abc");
  try { normalize('{"name":"sessionid","value":"private;bad"}'); }
  catch (error) { assert.equal(error.message.includes("private"), false); }
});
