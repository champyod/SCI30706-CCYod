/**
 * Build script to combine HTML, CSS, and JS into a single index.html file
 * Run with: bun build.js
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const root = resolve(".");

function readFile(relPath) {
  return readFileSync(resolve(root, relPath), "utf-8");
}

function writeFile(relPath, content) {
  writeFileSync(resolve(root, relPath), content, "utf-8");
}

const html = readFile("index.html");
const css = readFile("styles/style.css");
const js = readFile("scripts/main.js");

const cssTag = `<style>\n${css}\n</style>`;
const jsTag = `<script>\n${js}\n</script>`;

let output = html
  .replace('<link rel="stylesheet" href="styles/style.css" />', cssTag)
  .replace('<script src="scripts/main.js"></script>', jsTag);

writeFile("index.built.html", output);
console.log("Built index.built.html successfully!");