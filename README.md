# create-gas-scaffold

Scaffold a **TypeScript Google Apps Script** project in seconds — server-only script, JSON API, or a React front end (SPA or MPA) — with esbuild bundling, a `clasp` deploy workflow, and a built-in dev/prod split.

## Quick start

```sh
pnpm create gas-scaffold
# or
npm create gas-scaffold@latest
# or
pnpm dlx create-gas-scaffold
```

The wizard asks four questions:

1. **Project name** — becomes the target folder and the (slugified) `package.json` name. Enter `.` to scaffold into the current directory.
2. **Project type** — one of the four templates below.
3. **Script ID (prod)** — written into `.clasp-prod.json`.
4. **Script ID (dev)** — written into `.clasp-dev.json`.

Then it copies the chosen template, activates the dotfiles (`_gitignore` → `.gitignore`, `_gitattributes` → `.gitattributes`), and fills in your script IDs and project name.

## Templates

| Prompt | Folder | What it is |
| --- | --- | --- |
| **API only** | `template-api-only` | A web app that returns JSON from `doGet`/`doPost`. No UI. |
| **API and MPA frontend with React** | `template-react-mpa` | Multiple React pages, each built into one inlined HTML file and served via `HtmlService`. Routed with `?page=`. |
| **API and SPA frontend with React** | `template-react-spa` | A single React page with client-side view switching. |
| **Server only script with no API** | `template-server-only-no-api` | A plain script/automation (no web app, no `doGet`). |

All templates are TypeScript, share the same lint/format/build tooling, and are standalone (no monorepo).

## After scaffolding

```sh
cd my-project
pnpm install

# one-time: authenticate clasp and enable the Apps Script API
pnpm exec clasp login
# -> also enable it at https://script.google.com/home/usersettings

pnpm push        # build + deploy to your DEV script
```

You'll need a Google account and an Apps Script **Script ID** for dev and prod (from an existing project's *Project Settings → IDs*, or `clasp create`). The wizard writes those IDs for you; `clasp login` and enabling the Apps Script API are the only manual steps.

## Scripts (inside a generated project)

| Script | What it does |
| --- | --- |
| `pnpm dev` | Vite dev server for the client (React templates only). |
| `pnpm build` | Bundle the server (and client) into `dist/`. |
| `pnpm push` | Lint, format, typecheck, build, then `clasp push` to the **dev** script. |
| `pnpm push:prod` | Same, but to the **prod** script. |
| `pnpm push:fast` | Build and push to dev, skipping the checks. |
| `pnpm typecheck` / `pnpm lint` / `pnpm format` | The individual quality gates. |

## How a generated project works

- **Server** — [esbuild](https://esbuild.github.io/) + [`esbuild-gas-plugin`](https://www.npmjs.com/package/esbuild-gas-plugin) bundle `src` into a single `dist/bundle.js`. Entry points (`doGet`, `doPost`, RPC functions) are exposed by assigning them to `global` in `src/**/main.ts`.
- **Client** (React templates) — [Vite](https://vite.dev/) + [`vite-plugin-singlefile`](https://www.npmjs.com/package/vite-plugin-singlefile) inline each page into one self-contained `.html` that `HtmlService` serves.
- **Deploy** — `clasp` pushes the `dist/` folder. The dev/prod split is just `.clasp-dev.json` / `.clasp-prod.json` copied to `.clasp.json` before each push (`.clasp.json` is git-ignored).

## Calling the server from the client (React templates)

The React templates include a typed RPC helper over `google.script.run`. A server function is exposed as a global:

```ts
// src/server/example.ts
export function add(a: number, b: number): number {
  return a + b;
}

// src/server/main.ts
global.add = add;
```

The definition should also be included in the RPC helper
```ts
  // src/client/lib/rpc.ts
  add: (...args: Parameters<typeof add>) => call<ReturnType<typeof add>>('add', ...args),
```

and called from the client with a Promise wrapper whose signature is derived from the server function:

```ts
import { server } from './lib/rpc';

const sum = await server.add(1, 2); // typed as Promise<number>
```

> `google.script.run` only exists inside the Apps Script host, so RPC calls throw during `pnpm dev`. Use effect + state to consume them in React.

## Requirements

- **Node.js ≥ 20** and **pnpm**
- A Google account with the **Apps Script API** enabled
- `clasp` (bundled as a dev dependency of each template)

## Developing the generator

```sh
pnpm install
pnpm dev      # run the wizard from source (node strips the TS types)
pnpm build    # bundle src/index.ts -> dist/index.js with esbuild
```

Templates live in `templates/` and are **bundled as raw assets** — copied verbatim at scaffold time, never transpiled by the CLI build. Keep them free of `node_modules`/`dist` (both are git-ignored) so nothing extra ends up in the published package.

## License

MIT
