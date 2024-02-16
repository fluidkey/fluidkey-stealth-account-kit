import { typescript } from 'projen';
import { NpmAccess } from 'projen/lib/javascript';
const project = new typescript.TypeScriptProject({
  name: '@fluidkey/trust-kit',
  projenrcTs: true,
  depsUpgrade: false,

  // github
  github: true,
  authorName: 'Fluid Privacy SA',
  authorEmail: 'it@fluidkey.com',
  gitignore: ['.idea/', '.env', '.yalc'],
  license: 'MIT',

  // NPMjs Configuration
  authorOrganization: true,
  packageName: '@fluidkey/trust-kit',
  releaseToNpm: true,
  npmAccess: NpmAccess.PUBLIC,
  defaultReleaseBranch: 'main',

  deps: [
    '@noble/secp256k1@1.7.1',
    '@safe-global/safe-deployments@1.29.0',
    'viem@2.7.9',
  ],
  devDeps: [
    'istanbul-badges-readme@1.8.5',
    'fast-check@3.15.0',
  ],
  tsconfig: {
    exclude: [
      'example/**/*',
    ],
    compilerOptions: {
      // needed due to bug with viem types. In the future, try to remove it and run npx projen build to see if viem types are fixed
      skipLibCheck: true,
      lib: [
        'es2019', 'dom',
      ],
    },
  },
  jestOptions: {
    jestConfig: {
      collectCoverage: true,
      coverageReporters: ['json-summary', 'lcov'],
    },
  },
  scripts: {
    badges: 'istanbul-badges-readme',
  },
});

project.synth();
