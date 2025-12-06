import { render, screen } from '@test-utils';
import { describe, expect, it } from 'vitest';
import { SummarySection } from './SummarySection';

describe('SummarySection', () => {
  it('shows a skeleton when summary is missing', () => {
    render(<SummarySection summary={null} alerts={[]} />);

    expect(screen.getByTestId('summary-skeleton')).toBeInTheDocument();
    expect(screen.queryByText('Current Weather Summary')).not.toBeInTheDocument();
  });

  it('renders summary content and alerts when available', () => {
    render(
      <SummarySection
        summary="Sunny skies and a light breeze"
        alerts={[
          {
            id: 'alert-1',
            properties: { headline: 'Test Alert', description: 'Be prepared' },
          },
        ]}
      />
    );

    expect(screen.getByText('Current Weather Summary')).toBeInTheDocument();
    expect(screen.getByText('Sunny skies and a light breeze')).toBeInTheDocument();
    expect(screen.getByText('Active Weather Alerts')).toBeInTheDocument();
    expect(screen.getByText('Test Alert')).toBeInTheDocument();
  });
});
