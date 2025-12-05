import { render } from '@test-utils';
import { Welcome } from './Welcome';

describe('Welcome component', () => {
  it('has correct Vite guide link', () => {
    render(<Welcome />);
  });
});
