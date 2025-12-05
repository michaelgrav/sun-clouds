import '@mantine/core/styles.css';

import { useEffect } from 'react';
import { ColorSchemeScript, MantineProvider, useComputedColorScheme } from '@mantine/core';
import { Router } from './Router';
import { appPalettes, theme } from './theme';

function ThemeVariablesSync() {
  const colorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });

  useEffect(() => {
    const palette = appPalettes[colorScheme] ?? appPalettes.light;
    const root = document.documentElement;
    const setVar = (name: string, value: string) => root.style.setProperty(name, value);

    setVar('--app-bg', palette.background);
    setVar('--app-surface', palette.surface);
    setVar('--app-text', palette.text);
    setVar('--app-primary', palette.primary);
    setVar('--app-primary-strong', palette.primaryStrong);
    setVar('--app-accent', palette.accent);
    setVar('--app-accent-strong', palette.accentStrong);

    root.style.backgroundColor = palette.background;
    document.body.style.backgroundColor = palette.background;

    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', palette.background);
    }
  }, [colorScheme]);

  return null;
}

export default function App() {
  return (
    <>
      <ColorSchemeScript defaultColorScheme="auto" />
      <MantineProvider defaultColorScheme="auto" theme={theme}>
        <style>{`
:root { background-color: var(--app-bg, #f7fbff); color: var(--app-text, #0b2a3a); }
body { background-color: var(--app-bg, #f7fbff); color: var(--app-text, #0b2a3a); transition: background-color 150ms ease, color 150ms ease; }
#root { min-height: 100vh; background-color: var(--app-bg, #f7fbff); }
        `}</style>
        <ThemeVariablesSync />
        <Router />
      </MantineProvider>
    </>
  );
}
