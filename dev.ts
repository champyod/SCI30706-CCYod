import { build } from "bun";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const PORT = 3000;
const SRC_PREFIX = "/src/";
const STYLE_SHEET = "src/styles.css";

// Dev shell mirrors the build shell, but modules are served on demand
// (no inline script) so a browser refresh always gets fresh code.
const DEV_HTML_SHELL = `<!doctype html>
<html lang="th">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>FinGoal</title>
  <link rel="stylesheet" href="/src/styles.css">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;

// Only serve files under /src/; reject ".." escapes (also percent-encoded ones).
function resolveSrcPath(pathname: string): string | null {
  if (!pathname.startsWith(SRC_PREFIX)) {
    return null;
  }
  const decoded = decodeURIComponent(pathname);
  if (decoded.includes("..")) {
    return null;
  }
  return decoded.slice(1);
}

async function serveModule(pathname: string): Promise<Response> {
  const filePath = resolveSrcPath(pathname);
  if (!filePath || !existsSync(filePath)) {
    return new Response("not found", { status: 404 });
  }
  // Bun.build resolves bare imports (react, lib/) and transpiles JSX to JS.
  const result = await build({
    entrypoints: [filePath],
    target: "browser",
    minify: false,
  });
  const jsOutput = result.outputs.find((output) => output.path.endsWith(".js"));
  if (!jsOutput) {
    throw new Error(`build of ${filePath} produced no JS output`);
  }
  const code = await jsOutput.text();
  return new Response(code, {
    headers: { "content-type": "application/javascript" },
  });
}

async function serveStyle(): Promise<Response> {
  const css = await readFile(STYLE_SHEET, "utf8");
  return new Response(css, {
    headers: { "content-type": "text/css" },
  });
}

async function handleRequest(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url);
  if (pathname === "/") {
    return new Response(DEV_HTML_SHELL, {
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
  if (pathname === `${SRC_PREFIX}styles.css`) {
    return await serveStyle();
  }
  if (pathname.startsWith(SRC_PREFIX)) {
    return await serveModule(pathname);
  }
  return new Response("not found", { status: 404 });
}

Bun.serve({
  port: PORT,
  fetch(request) {
    return handleRequest(request).catch((error: unknown) => {
      console.error(error);
      return new Response("internal error", { status: 500 });
    });
  },
});

console.log(`dev server listening on http://localhost:${PORT}`);
