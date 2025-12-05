import { render, screen } from '@test-utils';
import { describe, expect, it } from 'vitest';
import { CurrentSummaryCard } from './CurrentSummaryCard';

describe('CurrentSummaryCard', () => {
  it('renders provided summary', () => {
    render(<CurrentSummaryCard summary="Clear skies" />);

    expect(screen.getByText('Current Weather Summary')).toBeInTheDocument();
    expect(screen.getByText('Clear skies')).toBeInTheDocument();
  });

  it('renders fallback when summary missing', () => {
    render(<CurrentSummaryCard />);

    expect(
      screen.getByText("No summary available :( I guess you're gonna have to look outside...")
    ).toBeInTheDocument();
  });
});
