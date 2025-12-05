import { createTheme, type MantineColorsTuple } from '@mantine/core';

const sky: MantineColorsTuple = [
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

const sunshine: MantineColorsTuple = [
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

export const appPalettes = {
  light: {
    background: '#f7fbff',
    surface: '#e8f2ff',
    text: '#0b2a3a',
    primary: '#2b8ef7',
    primaryStrong: '#1a75d0',
    accent: '#ffb429',
    accentStrong: '#e59c17',
  },
  dark: {
    background: '#0e1724',
    surface: '#162235',
    text: '#e8f1ff',
    primary: '#8cc7ff',
    primaryStrong: '#5caaf7',
    accent: '#ffd46c',
    accentStrong: '#e5a42b',
  },
} as const;

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
