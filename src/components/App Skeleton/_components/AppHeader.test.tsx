import { render, screen } from '@test-utils';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppShell } from '@mantine/core';
import { AppHeader } from './AppHeader';

describe('AppHeader', () => {
  it('renders brand text and toggles navigation', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();

    render(
      <AppShell header={{ height: 60 }}>
        <AppHeader opened={false} onToggle={onToggle} isSmallScreen={false} />
      </AppShell>
    );

    expect(screen.getByText('☀️ Sun Clouds ☁️')).toBeInTheDocument();
    await user.click(screen.getByLabelText('Toggle navigation'));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
