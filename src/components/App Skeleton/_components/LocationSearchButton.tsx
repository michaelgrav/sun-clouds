import { useState } from 'react';
import axios from 'axios';
import { ActionIcon, Button, Group, Modal, Stack, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

interface LocationSearchButtonProps {
  onLocationSelect: (latitude: number, longitude: number, label?: string) => void;
}

export const LocationSearchButton = ({ onLocationSelect }: LocationSearchButtonProps) => {
  const [opened, { open, close }] = useDisclosure(false);
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

    if (!city.trim()) {
      errors.city = 'City is required';
    }

    if (!state.trim()) {
      errors.state = 'State is required';
    } else if (state.trim().length < 2) {
      errors.state = 'Use a two-letter code or full state name';
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
      close();
    } catch (error) {
      setFieldErrors({ general: 'Unable to look up that location. Please try again.' });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        centered
        size="sm"
        radius="md"
        withCloseButton={false}
        title={
          <Text fw={700} size="lg" ta="center">
            Search by City & State
          </Text>
        }
      >
        <form onSubmit={handleSubmit}>
          <Stack gap="sm">
            <TextInput
              label="City"
              placeholder="e.g. Cypress"
              value={city}
              onChange={(event) => setCity(event.currentTarget.value)}
              required
              error={fieldErrors.city}
            />
            <TextInput
              label="State"
              placeholder="e.g. TX"
              value={state}
              onChange={(event) => setState(event.currentTarget.value)}
              required
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
            close();
          } else {
            open();
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
