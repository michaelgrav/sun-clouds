import { useEffect, useMemo, useState } from 'react';
import {
  ActionIcon,
  Center,
  Modal,
  Skeleton,
  Text,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

interface WeatherRadarModalProps {
  latitude: number | null;
  longitude: number | null;
  opened: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const WeatherRadarModal = ({
  latitude,
  longitude,
  opened,
  onOpen,
  onClose,
}: WeatherRadarModalProps) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const isSmall = useMediaQuery('(max-width: 768px)');
  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');

  const hasCoords = latitude != null && longitude != null;

  const modalGradient =
    colorScheme === 'dark'
      ? `linear-gradient(135deg, ${theme.colors.sky[8]}, ${theme.colors.sunshine[6]})`
      : `linear-gradient(135deg, ${theme.colors.sky[1]}, ${theme.colors.sunshine[2]})`;

  const accentWash = `radial-gradient(circle at 18% 18%, ${theme.colors.sunshine[3]}33, transparent 42%), radial-gradient(circle at 78% 12%, ${theme.colors.sky[4]}33, transparent 40%)`;

  const ctaStyle = {
    backgroundImage: `${accentWash}, ${modalGradient}`,
    border: `1px solid ${colorScheme === 'dark' ? theme.colors.sky[6] : theme.colors.sky[2]}`,
    boxShadow:
      colorScheme === 'dark' ? '0 10px 24px rgba(0,0,0,0.35)' : '0 10px 24px rgba(43,142,247,0.18)',
    color: colorScheme === 'dark' ? theme.colors.sunshine[1] : theme.black,
  } as const;

  const frameShell = {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative' as const,
    border: `1px solid ${colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'}`,
    boxShadow: '0 18px 48px rgba(0, 0, 0, 0.25)',
    backgroundImage: `${accentWash}, ${modalGradient}`,
    display: 'flex',
    flexDirection: 'column' as const,
    minHeight: '100%',
  };

  const radarSrc = useMemo(() => {
    if (!hasCoords || !opened) {
      return undefined;
    }
    return `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=in&metricTemp=%C2%B0F&metricWind=mph&zoom=7&overlay=radar&product=radar&level=surface&lat=${latitude}&lon=${longitude}&message=true`;
  }, [hasCoords, latitude, longitude, opened]);

  useEffect(() => {
    if (opened) {
      setMapLoaded(false);
    }
  }, [latitude, longitude, opened]);

  const shouldShowSkeleton = opened && (!hasCoords || (hasCoords && !mapLoaded));

  const handleClose = () => {
    setMapLoaded(false);
    onClose();
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={handleClose}
        fullScreen={false}
        size={isSmall ? '95%' : '100%'}
        radius="md"
        padding={0}
        overlayProps={{ blur: 2.5 }}
        withCloseButton={false}
        centered
        title={
          <Text
            fw={700}
            ta="center"
            size={isSmall ? 'lg' : 'xl'}
            style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}
          >
            <span aria-hidden="true">📡</span>
            <span>Live Weather Radar</span>
          </Text>
        }
        styles={{
          content: {
            minHeight: isSmall ? '75vh' : '85vh',
            height: isSmall ? '85vh' : '90vh',
            display: 'flex',
            flexDirection: 'column',
            backgroundImage: `${accentWash}, ${modalGradient}`,
            border: `1px solid ${colorScheme === 'dark' ? theme.colors.sky[7] : theme.colors.sky[2]}`,
            boxShadow: '0 20px 68px rgba(0, 0, 0, 0.35)',
          },
          header: { padding: '1rem 1.25rem', justifyContent: 'center', background: 'transparent' },
          title: { width: '100%', textAlign: 'center' },
          body: {
            padding: isSmall ? 12 : 16,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            flex: 1,
            gap: 12,
            background: 'transparent',
          },
        }}
      >
        <div style={frameShell}>
          {shouldShowSkeleton && (
            <Center
              style={{ flex: 1, width: '100%', minHeight: '100%', padding: isSmall ? 12 : 16 }}
            >
              <div
                data-testid="radar-skeleton"
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  padding: 16,
                  background:
                    colorScheme === 'dark'
                      ? 'linear-gradient(140deg, #1c1f26 0%, #0f1218 100%)'
                      : 'linear-gradient(140deg, #f1f6ff 0%, #e8f2ff 100%)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                  overflow: 'hidden',
                  border:
                    colorScheme === 'dark'
                      ? '1px solid rgba(255, 255, 255, 0.06)'
                      : '1px solid rgba(0, 0, 0, 0.04)',
                  position: 'relative',
                }}
              >
                <Skeleton height={14} width="30%" radius="sm" opacity={0.8} />

                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  {['Radar', 'Layers', 'Past', 'Future'].map((label) => (
                    <Skeleton key={label} height={22} width={76} radius="xl" opacity={0.65} />
                  ))}
                </div>

                <div
                  style={{
                    flex: 1,
                    borderRadius: 12,
                    position: 'relative',
                    overflow: 'hidden',
                    background:
                      colorScheme === 'dark'
                        ? 'radial-gradient(circle at 30% 40%, #2a2f3c, #0f1218 62%)'
                        : 'radial-gradient(circle at 30% 40%, #d8e7ff, #b8d4ff 62%)',
                  }}
                >
                  <Skeleton
                    height="100%"
                    width="100%"
                    radius="md"
                    style={{ position: 'absolute', inset: 0, opacity: 0.28 }}
                  />
                  <Skeleton
                    height={120}
                    width={120}
                    radius="50%"
                    style={{ position: 'absolute', top: '22%', left: '18%', opacity: 0.5 }}
                  />
                  <Skeleton
                    height={160}
                    width={160}
                    radius="50%"
                    style={{ position: 'absolute', bottom: '12%', right: '12%', opacity: 0.4 }}
                  />
                  <Skeleton
                    height={14}
                    width="22%"
                    radius="sm"
                    style={{ position: 'absolute', top: 12, right: 12, opacity: 0.7 }}
                  />
                  <Skeleton
                    height={10}
                    width="18%"
                    radius="sm"
                    style={{ position: 'absolute', bottom: 12, left: 12, opacity: 0.6 }}
                  />
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                    gap: 10,
                  }}
                >
                  {[0, 1, 2, 3].map((idx) => (
                    <Skeleton key={idx} height={12} radius="sm" opacity={0.7} />
                  ))}
                </div>
              </div>
            </Center>
          )}

          {opened && hasCoords && radarSrc && (
            <div style={{ flex: 1, minHeight: 0 }}>
              <iframe
                title="Weather Radar"
                width="100%"
                height="100%"
                src={radarSrc}
                style={{
                  border: 0,
                  borderRadius: 12,
                  display: mapLoaded ? 'block' : 'none',
                }}
                onLoad={() => setMapLoaded(true)}
              />
            </div>
          )}

          {opened && !hasCoords && (
            <Text ta="center" c="dimmed" size="sm" mb="md">
              Search for a location to view radar data.
            </Text>
          )}
        </div>
      </Modal>

      <ActionIcon
        variant="filled"
        size="xl"
        radius="xl"
        aria-label="Open radar map"
        onClick={() => {
          setMapLoaded(false);
          if (opened) {
            handleClose();
          } else {
            onOpen();
          }
        }}
        style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 2000, ...ctaStyle }}
      >
        🛰️
      </ActionIcon>
    </>
  );
};

export default WeatherRadarModal;
