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
    'viem@1.21.4',
  ],
  tsconfig: {
    include: [
      'example/**/*',
    ],
    compilerOptions: {
      lib: [
        'es2019', 'dom',
      ],
    },
  },
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: /* Build dependencies for this module. */,
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();
