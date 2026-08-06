import { build } from "bun";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { spawnSync } from "node:child_process";

const OUT_DIR = "dist";
const MAIN_ENTRY = "src/main.tsx";
const STYLE_SHEET = "src/styles.css";
const TAILWIND_BIN = "node_modules/.bin/tailwindcss";
const TAILWIND_TMP = `${OUT_DIR}/.tailwind.css`;

// HTML is generated in code — the built index.html is the only HTML artifact.
const HTML_SHELL = `<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FinGoal</title>
  <style>%STYLE%</style>
</head>
<body>
  <div id="root"></div>
  <script>%SCRIPT%</script>
</body>
</html>`;

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
  // Inline <script> content ends at the first literal "</script>" — react-dom
  // ships one inside a string — so escape it or the element truncates and the
  // rest of the bundle renders as visible text. "<\/script>" is the same bytes
  // to JS but doesn't terminate the HTML element.
  const safeScript = script.replaceAll("</script>", "<\\/script>");
  // Function form of replace avoids interpreting "$" sequences in the bundle.
  return template
    .replaceAll("%SCRIPT%", () => safeScript)
    .replaceAll("%STYLE%", () => style);
}

// Tailwind v4 compiles @import "tailwindcss" + @theme tokens into real CSS.
// The CLI must run after clearOutDir so dist exists for the temp output path.
function compileTailwind(): void {
  const result = spawnSync(TAILWIND_BIN, [
    "--input",
    STYLE_SHEET,
    "--output",
    TAILWIND_TMP,
    "--minify",
  ], { stdio: "inherit" });
  if (result.status !== 0) {
    throw new Error(`tailwindcss exited with status ${result.status ?? "signal"}`);
  }
}

async function main(): Promise<void> {
  assertRepoRoot();
  await clearOutDir();
  compileTailwind();

  const result = await build({
    entrypoints: [MAIN_ENTRY],
    outdir: `${OUT_DIR}/assets`,
    target: "browser",
    minify: true,
    splitting: false,
  });

  const jsPath = findJsOutput(result.outputs);
  const [script, style] = await Promise.all([
    readText(jsPath),
    readText(TAILWIND_TMP),
  ]);

  const html = inlineInto(HTML_SHELL, script, style);
  await writeFile(`${OUT_DIR}/index.html`, html);
  console.log(`built ${OUT_DIR}/index.html (${Buffer.byteLength(html)} bytes)`);
}

// Bun runs fine with top-level await, but tsc's default target forbids it — use the catch chain instead.
void main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
