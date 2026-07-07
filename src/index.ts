import { cancel, intro, isCancel, outro, select, text } from '@clack/prompts';
import { cpSync, existsSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

intro('create-gas-scaffold');

function checkCancel<T>(value: T | symbol): asserts value is T {
  if (isCancel(value)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }
}

const projectName = await text({
  message: 'Project name',
  placeholder: 'my-project',
  validate: (v) => (v?.trim() === '' ? 'Project name is required' : undefined),
});

checkCancel(projectName);

const projectType = await select({
  message: 'Pick a project type',
  options: [
    { value: 'template-api-only', label: 'API only' },
    { value: 'template-react-mpa', label: 'API and MPA frontend with React' },
    { value: 'template-react-spa', label: 'API and SPA frontend with React' },
    { value: 'template-server-only-no-api', label: 'Server only script with no API' },
  ],
});

checkCancel(projectType);

const scriptId = await text({
  message: 'Script ID (prod)',
  placeholder: '',
});

checkCancel(scriptId);

const scriptIdDev = await text({
  message: 'Script ID (dev)',
  placeholder: '',
});

checkCancel(scriptIdDev);

const templatesRoot = fileURLToPath(new URL('../templates', import.meta.url));
const templateDir = join(templatesRoot, projectType);
const targetDir = projectName === '.' ? process.cwd() : join(process.cwd(), projectName);

cpSync(templateDir, targetDir, {
  recursive: true,
  filter: (src) => !/[\\/](node_modules|dist)([\\/]|$)/.test(src),
});

const dictionary: [string, string][] = [
  ['_gitignore', '.gitignore'],
  ['_gitattributes', '.gitattributes'],
];

for (const [from, to] of dictionary) {
  const f = join(targetDir, from);

  if (existsSync(f)) renameSync(f, join(targetDir, to));
}

const claspConfigProd = join(targetDir, '.clasp-prod.json');
const claspConfigDev = join(targetDir, '.clasp-dev.json');
const packageConfigPath = join(targetDir, 'package.json');

const prodConfig = JSON.parse(readFileSync(claspConfigProd, 'utf-8'));
prodConfig.scriptId = scriptId;
writeFileSync(claspConfigProd, JSON.stringify(prodConfig, null, 2) + '\n');

const devConfig = JSON.parse(readFileSync(claspConfigDev, 'utf-8'));
devConfig.scriptId = scriptIdDev;
writeFileSync(claspConfigDev, JSON.stringify(devConfig, null, 2) + '\n');

const packageConfig = JSON.parse(readFileSync(packageConfigPath, 'utf-8'));
const packageName = projectName
  .toLowerCase()
  .replace(/[^a-z0-9-~]+/g, '-')
  .replace(/^-+|-+$/g, '');

packageConfig.name = packageName;
writeFileSync(packageConfigPath, JSON.stringify(packageConfig, null, 2) + '\n');

outro(projectName === '.' ? 'Done' : `Done — cd ${projectName} && pnpm install`);
