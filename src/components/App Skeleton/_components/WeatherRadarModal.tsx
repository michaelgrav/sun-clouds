import { useMemo, useState } from 'react';
import { ActionIcon, Center, Loader, Modal, Text } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

interface WeatherRadarModalProps {
  latitude: number | null;
  longitude: number | null;
}

export const WeatherRadarModal = ({ latitude, longitude }: WeatherRadarModalProps) => {
  const [mapOpened, { open: openMap, close: closeMap }] = useDisclosure(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const isSmall = useMediaQuery('(max-width: 768px)');

  const hasCoords = latitude != null && longitude != null;

  const radarSrc = useMemo(() => {
    if (!hasCoords) {
      return undefined;
    }
    return `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=in&metricTemp=%C2%B0F&metricWind=mph&zoom=7&overlay=radar&product=radar&level=surface&lat=${latitude}&lon=${longitude}&message=true`;
  }, [hasCoords, latitude, longitude]);

  return (
    <>
      <Modal
        opened={mapOpened}
        onClose={() => {
          setMapLoaded(false);
          closeMap();
        }}
        fullScreen={false}
        size={isSmall ? '95%' : '100%'}
        radius="md"
        padding={0}
        overlayProps={{ blur: 2.5 }}
        withCloseButton={false}
        centered
        title={
          <Text fw={700} ta="center" size={isSmall ? 'lg' : 'xl'}>
            Live Weather Radar
          </Text>
        }
        styles={{
          content: {
            minHeight: isSmall ? '75vh' : '85vh',
            height: isSmall ? '85vh' : '90vh',
          },
          header: { padding: '1rem 1.25rem', justifyContent: 'center' },
          title: { width: '100%', textAlign: 'center' },
          body: { padding: 0, display: 'flex', flexDirection: 'column', height: '100%' },
        }}
      >
        {(!hasCoords || (mapOpened && hasCoords && !mapLoaded)) && (
          <Center style={{ flex: 1 }}>
            <Loader color="yellow" size="lg" aria-label="radar-loader" />
          </Center>
        )}

        {mapOpened && hasCoords && (
          <div style={{ flex: 1 }}>
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
      </Modal>

      <ActionIcon
        variant="filled"
        color="yellow"
        size="xl"
        radius="xl"
        aria-label="Open radar map"
        onClick={() => {
          setMapLoaded(false);
          if (mapOpened) {
            closeMap();
          } else {
            openMap();
          }
        }}
        style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 2000 }}
      >
        🛰️
      </ActionIcon>
    </>
  );
};

export default WeatherRadarModal;
