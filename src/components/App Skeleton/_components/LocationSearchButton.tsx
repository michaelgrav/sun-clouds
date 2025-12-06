import { useState } from 'react';
import axios from 'axios';
import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Stack,
  Text,
  TextInput,
  useComputedColorScheme,
  useMantineTheme,
} from '@mantine/core';

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

      const [first] =
        (response.data as Array<{ lat: string; lon: string; display_name?: string }>) || [];

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

      onLocationSelect(lat, lon, first.display_name);
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

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        centered
        size="sm"
        radius="md"
        withCloseButton={false}
        title={
          <Text fw={700} size="lg" ta="center">
            Search by City & State
          </Text>
        }
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
        <form onSubmit={handleSubmit} style={{ padding: '0.25rem 0.5rem 0.5rem' }}>
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
              <Button
                type="submit"
                variant="gradient"
                gradient={{ from: 'blue', to: 'yellow', deg: 35 }}
                loading={isSearching}
                color="yellow"
                radius="xl"
              >
                Search 🔎
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <ActionIcon
        variant="filled"
        color="yellow"
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
        style={{ position: 'fixed', bottom: 16, right: 76, zIndex: 2000 }}
      >
        🔎
      </ActionIcon>
    </>
  );
};

export default LocationSearchButton;
