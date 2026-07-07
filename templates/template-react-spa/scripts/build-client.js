import { build } from 'vite';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';

// Single-page app: src/client/index.html is built into one self-contained
// dist/index.html, served by HtmlService.createHtmlOutputFromFile('index').
const clientRoot = resolve('src/client');

if (!existsSync(resolve(clientRoot, 'index.html'))) {
  throw new Error(`No index.html under ${clientRoot}`);
}

// build-server.js runs first and clears dist, so we only append here. We let
// vite.config.ts drive the build (root: src/client) so its single-file plugin
// inlines every asset into dist/index.html.
await build({
  logLevel: 'warn',
  build: {
    outDir: resolve('dist'),
    emptyOutDir: false,
  },
});
