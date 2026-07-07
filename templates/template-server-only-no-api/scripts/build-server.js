import { build } from 'esbuild';
import { cpSync, rmSync } from 'node:fs';
import path from 'node:path';
import { GasPlugin } from 'esbuild-gas-plugin';

const SRC = 'src';
const OUT = 'dist';

rmSync(OUT, { recursive: true, force: true });

cpSync(SRC, OUT, {
  recursive: true,
  filter: (source) => {
    const abs = path.resolve(source.replace(/^\\\\\?\\/, ''));
    return (
      abs !== SRC &&
      !abs.startsWith(SRC + path.sep) &&
      !source.endsWith('.js') &&
      !source.endsWith('.ts')
    );
  },
});

await build({
  entryPoints: ['./src/main.ts'],
  bundle: true,
  target: 'es2020',
  outfile: './dist/bundle.js',
  minify: true,
  charset: 'utf8',
  logLevel: 'info',
  plugins: [GasPlugin],
});
