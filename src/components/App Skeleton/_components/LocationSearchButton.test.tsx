import { render, screen, userEvent } from '@test-utils';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { SavedLocation } from '../../../../types/locations';
import { useLocationHistory } from '../../../hooks/useLocationHistory';
import { LocationSearchButton } from './LocationSearchButton';

vi.mock('../../../hooks/useLocationHistory');

const capturedModalProps: Array<{ size?: string | number }> = [];

vi.mock('@mantine/core', async () => {
  const actual = await vi.importActual<typeof import('@mantine/core')>('@mantine/core');

  return {
    ...actual,
    Modal: (props: any) => {
      capturedModalProps.push(props);
      return (
        <div role="dialog" data-size={props.size}>
          {props.children}
        </div>
      );
    },
  };
});

const baseProps = {
  opened: true,
  onOpen: vi.fn(),
  onClose: vi.fn(),
  onLocationSelect: vi.fn(),
};

describe('LocationSearchButton', () => {
  const mockUseLocationHistory = useLocationHistory as unknown as Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    capturedModalProps.length = 0;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const buildSavedLocation = (overrides: Partial<SavedLocation> = {}): SavedLocation => ({
    label: 'Austin, TX',
    latitude: 30.2672,
    longitude: -97.7431,
    isFavorite: false,
    updatedAt: 1,
    ...overrides,
  });

  it('uses fit-content layouts so long location labels are not truncated', () => {
    const longLabel = 'Lake Chargoggagoggmanchauggagoggchaubunagungamaugg, MA';

    mockUseLocationHistory.mockReturnValue({
      favorites: [buildSavedLocation({ label: longLabel, isFavorite: true })],
      recents: [],
      addRecent: vi.fn(),
      toggleFavorite: vi.fn(),
    });

    render(<LocationSearchButton {...baseProps} />);

    const locationButton = screen.getByRole('button', { name: longLabel });
    const paperCard = locationButton.closest('[class*="Paper-root"]') as HTMLElement | null;

    expect(locationButton.style.width).toBe('fit-content');
    expect(locationButton.style.whiteSpace).toBe('nowrap');
    expect(paperCard?.style.width).toBe('fit-content');
  });

  it('expands modal to full width on small screens', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    try {
      mockUseLocationHistory.mockReturnValue({
        favorites: [buildSavedLocation()],
        recents: [],
        addRecent: vi.fn(),
        toggleFavorite: vi.fn(),
      });

      render(<LocationSearchButton {...baseProps} />);

      screen.getByRole('dialog');
      const modalProps = capturedModalProps.at(-1);

      expect(modalProps?.size).toBe('100%');
    } finally {
      window.matchMedia = originalMatchMedia;
    }
  });

  it('closes the modal when selecting a saved location', async () => {
    const user = userEvent.setup();

    mockUseLocationHistory.mockReturnValue({
      favorites: [buildSavedLocation()],
      recents: [],
      addRecent: vi.fn(),
      toggleFavorite: vi.fn(),
    });

    const onClose = vi.fn();
    render(<LocationSearchButton {...baseProps} onClose={onClose} />);

    await user.click(screen.getByRole('button', { name: 'Austin, TX' }));

    expect(baseProps.onLocationSelect).toHaveBeenCalledWith(30.2672, -97.7431, 'Austin, TX');
    expect(onClose).toHaveBeenCalled();
  });
});
