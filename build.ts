import { build } from "bun";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const OUT_DIR = "dist";
const MAIN_ENTRY = "src/main.ts";
const HTML_TEMPLATE = "src/index.html";
const STYLE_SHEET = "src/styles.css";

// The entry path is repo-root-relative, so the script only works from the root.
function assertRepoRoot(): void {
  if (!existsSync(MAIN_ENTRY)) {
    throw new Error(`build must run from the repo root: missing ${MAIN_ENTRY}`);
  }
}

async function clearOutDir(): Promise<void> {
  if (existsSync(OUT_DIR)) {
    await rm(OUT_DIR, { recursive: true, force: true });
  }
  await mkdir(OUT_DIR, { recursive: true });
}

async function readText(path: string): Promise<string> {
  return await readFile(path, "utf8");
}

// Single entrypoint -> exactly one .js output; locate it instead of assuming the name.
function findJsOutput(outputs: Array<{ path: string }>): string {
  const js = outputs.find((output) => output.path.endsWith(".js"));
  if (!js) {
    throw new Error("bun build produced no JS output");
  }
  return js.path;
}

function inlineInto(
  template: string,
  script: string,
  style: string
): string {
  // Function form of replace avoids interpreting "$" sequences in the bundle.
  return template
    .replaceAll("%SCRIPT%", () => script)
    .replaceAll("%STYLE%", () => style);
}

async function main(): Promise<void> {
  assertRepoRoot();
  await clearOutDir();

  const result = await build({
    entrypoints: [MAIN_ENTRY],
    outdir: `${OUT_DIR}/assets`,
    target: "browser",
    minify: true,
    splitting: false,
  });

  const jsPath = findJsOutput(result.outputs);
  const [script, style, template] = await Promise.all([
    readText(jsPath),
    readText(STYLE_SHEET),
    readText(HTML_TEMPLATE),
  ]);

  const html = inlineInto(template, script, style);
  await writeFile(`${OUT_DIR}/index.html`, html);
  console.log(`built ${OUT_DIR}/index.html (${Buffer.byteLength(html)} bytes)`);
}

// Bun runs fine with top-level await, but tsc's default target forbids it — use the catch chain instead.
void main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
