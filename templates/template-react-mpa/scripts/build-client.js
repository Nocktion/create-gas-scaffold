import { build } from 'vite';
import { resolve } from 'node:path';
import { readdirSync, existsSync, renameSync, rmSync } from 'node:fs';

// Each subdirectory of src/client that contains an index.html is a "page".
// Every page is built as a self-contained single HTML file and flattened to
// dist/<page>.html, so Apps Script can serve it with
// HtmlService.createHtmlOutputFromFile('<page>').
const clientRoot = resolve('src/client');
const outDir = resolve('dist');

const pages = readdirSync(clientRoot, { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(resolve(clientRoot, d.name, 'index.html')))
  .map((d) => d.name);

if (!pages.length) throw new Error(`No pages under ${clientRoot}`);

// build-server.js runs first and clears dist, so we only append here. We let
// vite.config.ts drive the build (root: src/client) — overriding root here
// would stop vite from discovering the config and its single-file plugin.
for (const page of pages) {
  await build({
    logLevel: 'warn',
    build: {
      outDir,
      emptyOutDir: false,
      rollupOptions: {
        input: { [page]: resolve(clientRoot, page, 'index.html') },
      },
    },
  });

  // vite writes dist/<page>/index.html (path relative to root: src/client);
  // flatten it to dist/<page>.html and drop the now-empty directory.
  renameSync(resolve(outDir, page, 'index.html'), resolve(outDir, `${page}.html`));
  rmSync(resolve(outDir, page), { recursive: true, force: true });
}
