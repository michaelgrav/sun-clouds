import { useEffect, useMemo, useState } from 'react';
import { ActionIcon, Center, Modal, Skeleton, Text } from '@mantine/core';
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
    if (!hasCoords || !mapOpened) {
      return undefined;
    }
    return `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=in&metricTemp=%C2%B0F&metricWind=mph&zoom=7&overlay=radar&product=radar&level=surface&lat=${latitude}&lon=${longitude}&message=true`;
  }, [hasCoords, latitude, longitude, mapOpened]);

  useEffect(() => {
    if (mapOpened) {
      setMapLoaded(false);
    }
  }, [latitude, longitude, mapOpened]);

  const shouldShowSkeleton = mapOpened && (!hasCoords || (hasCoords && !mapLoaded));

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
            display: 'flex',
            flexDirection: 'column',
          },
          header: { padding: '1rem 1.25rem', justifyContent: 'center' },
          title: { width: '100%', textAlign: 'center' },
          body: {
            padding: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            flex: 1,
          },
        }}
      >
        {shouldShowSkeleton && (
          <Center style={{ flex: 1, width: '100%', minHeight: '100%' }}>
            <Skeleton
              width="100%"
              height="100%"
              radius="lg"
              data-testid="radar-skeleton"
            />
          </Center>
        )}

        {mapOpened && hasCoords && radarSrc && (
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

        {mapOpened && !hasCoords && (
          <Text ta="center" c="dimmed" size="sm" mb="md">
            Search for a location to view radar data.
          </Text>
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
