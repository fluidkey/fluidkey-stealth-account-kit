import { typescript } from 'projen';
import { NpmAccess } from 'projen/lib/javascript';
const project = new typescript.TypeScriptProject({
  name: '@fluidkey/trust-kit',
  projenrcTs: true,
  depsUpgrade: false,

  // github
  github: true,
  authorName: 'Fluidkey',
  authorEmail: 'it@fluidkey.com',
  gitignore: ['.idea/', '.env', '.yalc'],

  // NPMjs Configuration
  authorOrganization: true,
  packageName: '@fluidkey/trust-kit',
  releaseToNpm: true,
  npmAccess: NpmAccess.RESTRICTED,
  defaultReleaseBranch: 'main',

  deps: [
    '@noble/secp256k1@1.7.1',
    '@safe-global/safe-deployments@1.29.0',
    // 'viem@2.0.6',
    'viem@1.19.11',
  ],
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  devDeps: [
    // 'eslint-config-prettier@^9.1.0',
    // 'eslint-config-standard-with-typescript@^43.0.0',
    // 'eslint-plugin-n@^16.6.2',
    // 'eslint-plugin-prettier@^5.1.3',
    // 'eslint-plugin-promise@^6.1.1',
    // 'prettier@^3.1.1',
  ] /* Build dependencies for this module. */,
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();
