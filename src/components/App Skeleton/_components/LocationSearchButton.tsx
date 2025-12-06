import { useMemo, useState } from 'react';
import axios from 'axios';
import {
  ActionIcon,
  Badge,
  Button,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { SavedLocation } from '../../../../types/locations';
import { useLocationHistory } from '../../../hooks/useLocationHistory';

interface LocationSearchButtonProps {
  opened: boolean;
  onOpen: () => void;
  onClose: () => void;
  onLocationSelect: (latitude: number, longitude: number, label?: string) => void;
}

export const LocationSearchButton = ({
  opened,
  onOpen,
  onClose,
  onLocationSelect,
}: LocationSearchButtonProps) => {
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    city?: string;
    state?: string;
    general?: string;
  }>({});
  const [isSearching, setIsSearching] = useState(false);
  const { favorites, recents, addRecent, toggleFavorite } = useLocationHistory();

  const validate = () => {
    const errors: { city?: string; state?: string } = {};

    const cityValue = city.trim();
    const stateValue = state.trim();

    if (!cityValue) {
      errors.city = 'City is required';
    } else if (cityValue.length < 2) {
      errors.city = 'City must be at least 2 characters';
    } else if (cityValue.length > 80) {
      errors.city = 'City must be 80 characters or fewer';
    } else if (!/^[a-zA-Z][a-zA-Z '’-]{1,79}$/.test(cityValue)) {
      errors.city = 'Use letters, spaces, hyphens, or apostrophes only';
    }

    if (!stateValue) {
      errors.state = 'State is required';
    } else if (!/^[a-zA-Z]{2}$/.test(stateValue)) {
      errors.state = 'Use a two-letter state code (letters only)';
    }

    setFieldErrors((prev) => ({ ...prev, ...errors, general: undefined }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSearching(true);
    setFieldErrors((prev) => ({ ...prev, general: undefined }));

    try {
      const query = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&city=${encodeURIComponent(
        city.trim()
      )}&state=${encodeURIComponent(state.trim())}&countrycodes=us`;

      const response = await axios.get(query);

      type NominatimAddress = {
        city?: string;
        town?: string;
        village?: string;
        hamlet?: string;
        municipality?: string;
        county?: string;
        state?: string;
        state_district?: string;
        country?: string;
      };

      type NominatimResult = {
        lat: string;
        lon: string;
        display_name?: string;
        address?: NominatimAddress;
      };

      const [first] = (response.data as NominatimResult[]) || [];

      if (!first) {
        setFieldErrors({
          general: 'No matching location found. Please enter a valid city and state.',
        });
        return;
      }

      const lat = Number(first.lat);
      const lon = Number(first.lon);

      if (Number.isNaN(lat) || Number.isNaN(lon)) {
        setFieldErrors({ general: 'Location lookup returned invalid coordinates.' });
        return;
      }

      const cityName =
        first.address?.city ||
        first.address?.town ||
        first.address?.village ||
        first.address?.hamlet ||
        first.address?.municipality ||
        city.trim();

      const usStateMap: Record<string, string> = {
        Alabama: 'AL',
        Alaska: 'AK',
        Arizona: 'AZ',
        Arkansas: 'AR',
        California: 'CA',
        Colorado: 'CO',
        Connecticut: 'CT',
        Delaware: 'DE',
        Florida: 'FL',
        Georgia: 'GA',
        Hawaii: 'HI',
        Idaho: 'ID',
        Illinois: 'IL',
        Indiana: 'IN',
        Iowa: 'IA',
        Kansas: 'KS',
        Kentucky: 'KY',
        Louisiana: 'LA',
        Maine: 'ME',
        Maryland: 'MD',
        Massachusetts: 'MA',
        Michigan: 'MI',
        Minnesota: 'MN',
        Mississippi: 'MS',
        Missouri: 'MO',
        Montana: 'MT',
        Nebraska: 'NE',
        Nevada: 'NV',
        'New Hampshire': 'NH',
        'New Jersey': 'NJ',
        'New Mexico': 'NM',
        'New York': 'NY',
        'North Carolina': 'NC',
        'North Dakota': 'ND',
        Ohio: 'OH',
        Oklahoma: 'OK',
        Oregon: 'OR',
        Pennsylvania: 'PA',
        'Rhode Island': 'RI',
        'South Carolina': 'SC',
        'South Dakota': 'SD',
        Tennessee: 'TN',
        Texas: 'TX',
        Utah: 'UT',
        Vermont: 'VT',
        Virginia: 'VA',
        Washington: 'WA',
        'West Virginia': 'WV',
        Wisconsin: 'WI',
        Wyoming: 'WY',
        'District of Columbia': 'DC',
      };

      const stateName = first.address?.state ?? state.trim();
      const stateCode = usStateMap[stateName] ?? state.trim().toUpperCase();

      const label = `${cityName}, ${stateCode}`;

      onLocationSelect(lat, lon, label);
      addRecent({ label, latitude: lat, longitude: lon });
      setCity('');
      setState('');
      setFieldErrors({});
      onClose();
    } catch (error) {
      setFieldErrors({ general: 'Unable to look up that location. Please try again.' });
    } finally {
      setIsSearching(false);
    }
  };

  const theme = useMantineTheme();
  const colorScheme = useComputedColorScheme('light');

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
    color: colorScheme === 'dark' ? theme.colors.sunshine[2] : theme.black,
  } as const;

  const isSmall = useMediaQuery('(max-width: 768px)');

  const renderSavedLocations = (items: SavedLocation[], emptyLabel: string) => {
    if (!items.length) {
      return (
        <Text size="sm" c={colorScheme === 'dark' ? 'gray.2' : 'dimmed'} ta="center" mb="sm">
          {emptyLabel}
        </Text>
      );
    }

    return (
      <Group gap="sm" justify="flex-start" align="stretch" wrap="wrap" mb="sm">
        {items.map((item) => {
          const key = `${item.latitude},${item.longitude}`;
          return (
            <Paper
              key={key}
              withBorder
              radius="md"
              p="xs"
              shadow="xs"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                justifyContent: 'space-between',
                backgroundImage: `${accentWash}, ${modalGradient}`,
                border: `1px solid ${colorScheme === 'dark' ? theme.colors.sky[7] : theme.colors.sky[2]}`,
                boxShadow:
                  colorScheme === 'dark'
                    ? '0 10px 24px rgba(0,0,0,0.35)'
                    : '0 10px 24px rgba(43,142,247,0.18)',
                width: 'fit-content',
                maxWidth: '100%',
                flex: '0 0 auto',
              }}
            >
              <Button
                variant="light"
                radius="md"
                styles={{
                  root: {
                    backgroundImage: `${accentWash}, ${modalGradient}`,
                    border: `1px solid ${colorScheme === 'dark' ? theme.colors.sky[6] : theme.colors.sky[2]}`,
                    color: colorScheme === 'dark' ? theme.colors.sunshine[2] : theme.black,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 8,
                    whiteSpace: 'nowrap',
                    textAlign: 'left',
                    minHeight: 44,
                    width: 'fit-content',
                    maxWidth: '100%',
                    paddingInline: 12,
                    overflow: 'visible',
                  },
                }}
                onClick={() => {
                  onLocationSelect(item.latitude, item.longitude, item.label);
                  onClose();
                }}
                leftSection={<span aria-hidden="true">📍</span>}
              >
                <span style={{ flex: '0 1 auto' }}>{item.label}</span>
              </Button>
              <ActionIcon
                aria-label="Toggle favorite"
                variant={item.isFavorite ? 'filled' : 'outline'}
                color={item.isFavorite ? 'yellow' : 'gray'}
                onClick={() =>
                  toggleFavorite({ latitude: item.latitude, longitude: item.longitude })
                }
              >
                {item.isFavorite ? '⭐️' : '☆'}
              </ActionIcon>
            </Paper>
          );
        })}
      </Group>
    );
  };

  const hasSaved = useMemo(() => favorites.length > 0 || recents.length > 0, [favorites, recents]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        centered
        size={isSmall ? '100%' : '60%'}
        radius="md"
        withCloseButton={false}
        styles={{
          content: {
            backgroundImage: `${accentWash}, ${modalGradient}`,
            border: `1px solid ${colorScheme === 'dark' ? theme.colors.sky[7] : theme.colors.sky[2]}`,
            boxShadow: '0 18px 48px rgba(0, 0, 0, 0.32)',
          },
          header: { justifyContent: 'center', background: 'transparent' },
          title: { width: '100%', textAlign: 'center' },
          body: { background: 'transparent', paddingBottom: 16 },
        }}
      >
        <form onSubmit={handleSubmit}>
          <Stack
            gap="sm"
            style={{
              padding: 12,
              borderRadius: 12,
              background:
                colorScheme === 'dark' ? 'rgba(14, 23, 36, 0.75)' : 'rgba(247, 251, 255, 0.72)',
              border: `1px solid ${colorScheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
            }}
          >
            <Text fw={700} size="lg" ta="center">
              Search by City & State
            </Text>
            <TextInput
              label="City"
              placeholder="e.g. Cypress"
              value={city}
              onChange={(event) => setCity(event.currentTarget.value)}
              required
              maxLength={80}
              error={fieldErrors.city}
            />
            <TextInput
              label="State"
              placeholder="e.g. TX"
              value={state}
              onChange={(event) => setState(event.currentTarget.value)}
              required
              maxLength={2}
              error={fieldErrors.state}
            />
            {fieldErrors.general ? (
              <Text c="red" size="sm">
                {fieldErrors.general}
              </Text>
            ) : null}
            <Group justify="flex-end">
              <Button type="submit" loading={isSearching} radius="xl" styles={{ root: ctaStyle }}>
                Search 🔎
              </Button>
            </Group>
          </Stack>
        </form>

        <Stack
          gap="xs"
          mt="sm"
          style={{
            padding: 12,
            borderRadius: 12,
            background:
              colorScheme === 'dark' ? 'rgba(14, 23, 36, 0.75)' : 'rgba(247, 251, 255, 0.72)',
            border: `1px solid ${colorScheme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'}`,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <Group gap="xs" align="center" justify="space-between">
            <Text fw={700} size="sm">
              Quick switch
            </Text>
            {hasSaved ? (
              <Badge size="sm">Saved Locally</Badge>
            ) : (
              <Badge size="sm" color="gray">
                None
              </Badge>
            )}
          </Group>

          <Text size="sm" fw={600} mt={4}>
            Favorites
          </Text>
          {renderSavedLocations(favorites, 'No favorites yet. Mark a recent place with ⭐️.')}

          <Text size="sm" fw={600} mt={4}>
            Recent searches
          </Text>
          {renderSavedLocations(recents, 'No recent locations yet.')}
        </Stack>
      </Modal>

      <ActionIcon
        variant="filled"
        size="xl"
        radius="xl"
        aria-label="Search location"
        onClick={() => {
          setFieldErrors({});
          if (opened) {
            onClose();
          } else {
            onOpen();
          }
        }}
        style={{
          position: 'fixed',
          bottom: 16,
          right: 76,
          zIndex: 2000,
          ...ctaStyle,
        }}
      >
        🔎
      </ActionIcon>
    </>
  );
};

export default LocationSearchButton;
