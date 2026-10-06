import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

// The crawler is spawned as a separate Node process, so Next cannot follow its
// imports. Include its installed dependency tree in the route's production trace.
export function crawlerRuntimeFiles(root) {
  const seen = new Set();
  const files = [];
  function visit(name, from) {
    const require = createRequire(from);
    let entry;
    try { entry = require.resolve(`${name}/package.json`); }
    catch { entry = require.resolve(name); }
    let directory = path.dirname(entry);
    let manifest;
    while (true) {
      const filename = path.join(directory, "package.json");
      if (fs.existsSync(filename)) {
        const candidate = JSON.parse(fs.readFileSync(filename, "utf8"));
        if (candidate.name === name) { manifest = candidate; break; }
      }
      const parent = path.dirname(directory);
      if (parent === directory) throw new Error(`Cannot locate crawler dependency: ${name}`);
      directory = parent;
    }
    if (seen.has(directory)) return;
    seen.add(directory);
    files.push(`./${path.relative(root, directory).split(path.sep).join("/")}/**/*`);
    const packageFile = path.join(directory, "package.json");
    for (const dependency of Object.keys(manifest.dependencies ?? {})) visit(dependency, packageFile);
    for (const dependency of Object.keys(manifest.optionalDependencies ?? {})) {
      try { require.resolve(dependency); } catch { continue; }
      visit(dependency, packageFile);
    }
  }
  for (const name of ["@next/env", "cheerio", "mongodb", "ffmpeg-static"]) visit(name, path.join(root, "package.json"));
  return files;
}
