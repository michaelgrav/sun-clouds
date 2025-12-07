import { useCallback, useEffect, useRef } from 'react';
import { IconMoon, IconShadow, IconSun } from '@tabler/icons-react';
import {
  ActionIcon,
  Group,
  MantineColorScheme,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';

const modes: Array<{ value: MantineColorScheme; label: string; icon: React.ReactNode }> = [
  { value: 'auto', label: 'Auto (match system)', icon: <IconShadow size={18} stroke={1.8} /> },
  { value: 'light', label: 'Light', icon: <IconSun size={18} stroke={1.8} /> },
  { value: 'dark', label: 'Dark', icon: <IconMoon size={18} stroke={1.8} /> },
];

export function ColorSchemeToggle() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const theme = useMantineTheme();
  const pressTimerRef = useRef<number | null>(null);
  const partyTimerRef = useRef<number | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const emojiContainerRef = useRef<HTMLDivElement | null>(null);
  const emojiStyleRef = useRef<HTMLStyleElement | null>(null);
  const restoreRef = useRef<{
    rootBackground: string;
    rootImage: string;
    bodyBackground: string;
    bodyImage: string;
  } | null>(null);

  const modalGradient =
    computed === 'dark'
      ? `linear-gradient(135deg, ${theme.colors.sky[8]}, ${theme.colors.sunshine[6]})`
      : `linear-gradient(135deg, ${theme.colors.sky[1]}, ${theme.colors.sunshine[2]})`;

  const accentWash = `radial-gradient(circle at 18% 18%, ${theme.colors.sunshine[3]}33, transparent 42%), radial-gradient(circle at 78% 12%, ${theme.colors.sky[4]}33, transparent 40%)`;

  const enablePartyMode = useCallback(() => {
    const root = document.documentElement;
    const body = document.body;

    pressTimerRef.current = null;

    restoreRef.current = {
      rootBackground: root.style.backgroundColor,
      rootImage: root.style.backgroundImage,
      bodyBackground: body.style.backgroundColor,
      bodyImage: body.style.backgroundImage,
    };

    const partyGradient =
      'radial-gradient(circle at 20% 20%, #ff6cab 0%, transparent 35%), radial-gradient(circle at 80% 20%, #7cffe7 0%, transparent 35%), linear-gradient(120deg, #1fd1f9, #ff6cab, #fffd87)';

    root.style.backgroundImage = partyGradient;
    body.style.backgroundImage = partyGradient;
    root.style.backgroundColor = 'transparent';
    body.style.backgroundColor = 'transparent';

    if (!overlayRef.current) {
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '9999';
      overlay.style.backgroundImage = partyGradient;
      overlay.style.opacity = '0.28';
      overlay.style.transition = 'opacity 200ms ease';
      overlayRef.current = overlay;
      document.body.appendChild(overlay);
    }

    if (!emojiStyleRef.current) {
      const styleTag = document.createElement('style');
      styleTag.textContent = `
@keyframes floatUpParty {
  0% { transform: translateY(110vh) translateX(var(--offset, 0)); opacity: 0; }
  10% { opacity: 1; }
  100% { transform: translateY(-10vh) translateX(var(--offset, 0)); opacity: 0; }
}
      `;
      emojiStyleRef.current = styleTag;
      document.head.appendChild(styleTag);
    }

    if (!emojiContainerRef.current) {
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.inset = '0';
      container.style.pointerEvents = 'none';
      container.style.overflow = 'hidden';
      container.style.zIndex = '9999';
      emojiContainerRef.current = container;
      document.body.appendChild(container);

      const emojis = ['🎉', '🎊', '🥳', '✨'];
      for (let i = 0; i < 12; i += 1) {
        const span = document.createElement('span');
        span.textContent = emojis[i % emojis.length];
        span.style.position = 'absolute';
        span.style.left = `${Math.random() * 100}%`;
        span.style.fontSize = `${28 + Math.random() * 12}px`;
        span.style.animation = `floatUpParty ${4 + Math.random() * 3}s linear ${Math.random()}s infinite`;
        span.style.setProperty('--offset', `${Math.random() * 40 - 20}vw`);
        container.appendChild(span);
      }
    }

    if (!popupRef.current) {
      const popup = document.createElement('div');
      popup.textContent = 'Party mode engaged!';
      popup.style.position = 'fixed';
      popup.style.left = '50%';
      popup.style.bottom = '28px';
      popup.style.transform = 'translateX(-50%)';
      popup.style.padding = '10px 16px';
      popup.style.borderRadius = '14px';
      popup.style.fontWeight = '800';
      popup.style.fontSize = '16px';
      popup.style.color = '#0b2a3a';
      popup.style.background = 'rgba(255,255,255,0.92)';
      popup.style.boxShadow = '0 10px 32px rgba(0,0,0,0.25)';
      popup.style.letterSpacing = '0.3px';
      popup.style.zIndex = '9999';
      popup.style.pointerEvents = 'none';
      popup.style.border = '2px solid #0b2a3a';
      popupRef.current = popup;
      document.body.appendChild(popup);
    }

    if (partyTimerRef.current) {
      window.clearTimeout(partyTimerRef.current);
    }
    partyTimerRef.current = window.setTimeout(() => {
      const restore = restoreRef.current;
      if (restore) {
        root.style.backgroundColor = restore.rootBackground;
        root.style.backgroundImage = restore.rootImage;
        body.style.backgroundColor = restore.bodyBackground;
        body.style.backgroundImage = restore.bodyImage;
      }
      partyTimerRef.current = null;
      if (overlayRef.current) {
        document.body.removeChild(overlayRef.current);
        overlayRef.current = null;
      }
      if (emojiContainerRef.current) {
        document.body.removeChild(emojiContainerRef.current);
        emojiContainerRef.current = null;
      }
      if (popupRef.current) {
        document.body.removeChild(popupRef.current);
        popupRef.current = null;
      }
      if (emojiStyleRef.current) {
        document.head.removeChild(emojiStyleRef.current);
        emojiStyleRef.current = null;
      }
    }, 8000);
  }, []);

  const startLongPress = () => {
    if (pressTimerRef.current) {
      window.clearTimeout(pressTimerRef.current);
    }
    pressTimerRef.current = window.setTimeout(enablePartyMode, 700);
  };

  const cancelLongPress = () => {
    if (pressTimerRef.current) {
      window.clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  useEffect(
    () => () => {
      if (pressTimerRef.current) {
        window.clearTimeout(pressTimerRef.current);
      }
      if (partyTimerRef.current) {
        window.clearTimeout(partyTimerRef.current);
      }
      if (overlayRef.current) {
        document.body.removeChild(overlayRef.current);
        overlayRef.current = null;
      }
      if (emojiContainerRef.current) {
        document.body.removeChild(emojiContainerRef.current);
        emojiContainerRef.current = null;
      }
      if (popupRef.current) {
        document.body.removeChild(popupRef.current);
        popupRef.current = null;
      }
      if (emojiStyleRef.current) {
        document.head.removeChild(emojiStyleRef.current);
        emojiStyleRef.current = null;
      }
    },
    []
  );

  return (
    <Group gap="xs" align="center" wrap="nowrap">
      {modes.map((mode) => {
        const isActive = colorScheme === mode.value;
        const intent = isActive ? 'filled' : 'default';

        return (
          <Tooltip key={mode.value} label={mode.label} withArrow>
            <ActionIcon
              variant={intent}
              size="lg"
              radius="xl"
              aria-pressed={isActive}
              aria-label={mode.label}
              onClick={() => setColorScheme(mode.value)}
              onPointerDown={startLongPress}
              onPointerUp={cancelLongPress}
              onPointerLeave={cancelLongPress}
              onPointerCancel={cancelLongPress}
              onMouseDown={startLongPress}
              onMouseUp={cancelLongPress}
              onMouseLeave={cancelLongPress}
              onTouchStart={startLongPress}
              onTouchEnd={cancelLongPress}
              onTouchCancel={cancelLongPress}
              color={computed === 'dark' ? 'yellow' : 'blue'}
              style={{
                backgroundImage: `${accentWash}, ${modalGradient}`,
                border: `1px solid ${computed === 'dark' ? theme.colors.sky[6] : theme.colors.sky[2]}`,
                boxShadow:
                  computed === 'dark'
                    ? '0 10px 24px rgba(0,0,0,0.35)'
                    : '0 10px 24px rgba(43,142,247,0.18)',
              }}
            >
              {mode.icon}
            </ActionIcon>
          </Tooltip>
        );
      })}
    </Group>
  );
}
