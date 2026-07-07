import { build } from 'esbuild';
import { cpSync, rmSync } from 'node:fs';
import path from 'node:path';
import { GasPlugin } from 'esbuild-gas-plugin';

const SRC = 'src';
const OUT = 'dist';
const TS_DIR = path.resolve(SRC, 'server');
const CLIENT_DIR = path.resolve(SRC, 'client');

rmSync(OUT, { recursive: true, force: true });

cpSync(SRC, OUT, {
  recursive: true,
  filter: (source) => {
    const abs = path.resolve(source.replace(/^\\\\\?\\/, ''));
    return (
      abs !== TS_DIR &&
      !abs.startsWith(TS_DIR + path.sep) &&
      abs !== CLIENT_DIR &&
      !abs.startsWith(CLIENT_DIR + path.sep) &&
      !source.endsWith('.js') &&
      !source.endsWith('.ts') &&
      !source.endsWith('.jsx') &&
      !source.endsWith('.tsx')
    );
  },
});

await build({
  entryPoints: ['./src/server/main.ts'],
  bundle: true,
  target: 'es2020',
  outfile: './dist/bundle.js',
  minify: true,
  charset: 'utf8',
  logLevel: 'info',
  plugins: [GasPlugin],
});
