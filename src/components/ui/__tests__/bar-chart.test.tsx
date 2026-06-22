import { render, screen } from '@testing-library/react-native';

import { BarChart } from '../bar-chart';

describe('BarChart', () => {
  it('renders all bars', async () => {
    await render(
      <BarChart
        data={[
          { label: 'Jan', value: 50 },
          { label: 'Feb', value: 75, active: true },
        ]}
      />,
    );

    expect(screen.getByText('Jan')).toBeTruthy();
    expect(screen.getByText('Feb')).toBeTruthy();
  });
});
