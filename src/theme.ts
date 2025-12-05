import { createTheme } from '@mantine/core';

const sky = [
  '#e8f5ff',
  '#d2eaff',
  '#a9d4ff',
  '#7fbdff',
  '#55a6ff',
  '#2b8ef7',
  '#1a75d0',
  '#125da5',
  '#0a447a',
  '#052d52',
];

const sunshine = [
  '#fff9e6',
  '#fff2cc',
  '#ffe4a3',
  '#ffd57a',
  '#ffc452',
  '#ffb429',
  '#e59c17',
  '#b8790f',
  '#8a5709',
  '#5c3604',
];

export const theme = createTheme({
  primaryColor: 'sky',
  primaryShade: { light: 5, dark: 4 },
  colors: {
    sky,
    sunshine,
  },
  other: {
    accentColor: 'sunshine',
  },
  defaultRadius: 'md',
});
