import { typescript } from 'projen';
import { NodePackageManager, NpmAccess, YarnNodeLinker } from 'projen/lib/javascript';
const project = new typescript.TypeScriptProject({
  name: '@fluidkey/stealth-account-kit',
  projenrcTs: true,
  depsUpgrade: false,

  // github
  github: true,
  authorName: 'Fluid Privacy SA',
  authorEmail: 'it@fluidkey.com',
  gitignore: ['.idea/', '.env', '.yalc', '.history', '.yarn/install-state.gz'],
  license: 'MIT',
  majorVersion: 1,

  // Package Manager Configuration
  packageManager: NodePackageManager.YARN_BERRY,
  yarnBerryOptions: {
    version: '4.9.2',
    yarnRcOptions: {
      nodeLinker: YarnNodeLinker.NODE_MODULES,
      supportedArchitectures: {
        cpu: ['x64', 'arm64'],
        os: ['linux', 'darwin'],
        libc: ['glibc', 'musl'],
      },
    },
  },

  // NPMjs Configuration
  authorOrganization: true,
  packageName: '@fluidkey/stealth-account-kit',
  releaseToNpm: true,
  npmTrustedPublishing: true, // Enable npm Trusted Publisher (OIDC)
  npmAccess: NpmAccess.PUBLIC,
  defaultReleaseBranch: 'main',

  // GitHub workflow configuration
  githubOptions: {
    workflows: true,
    pullRequestLint: true,
  },
  workflowNodeVersion: '24', // Node 24 includes npm 11+ required for Trusted Publishing

  // Add custom workflow steps
  workflowBootstrapSteps: [
    {
      name: 'Enable Corepack',
      run: 'corepack enable',
    },
    {
      name: 'Set up Yarn',
      run: 'corepack prepare yarn@4.9.2 --activate',
    },
  ],

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
