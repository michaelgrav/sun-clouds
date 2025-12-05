import mantine from 'eslint-config-mantine';
import tseslint from 'typescript-eslint';

// @ts-check
export default tseslint.config(
  ...tseslint.configs.recommended,
  ...mantine,
  { ignores: ['**/*.{mjs,cjs,js,d.ts,d.mts}'] },
  {
    files: ['**/*.story.tsx'],
    rules: { 'no-console': 'off' },
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: process.cwd(),
        project: ['./tsconfig.eslint.json'],
      },
    },
  }
);
