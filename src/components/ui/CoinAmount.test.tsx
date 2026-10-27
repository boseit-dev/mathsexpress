import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CoinAmount } from './CoinAmount';

describe('CoinAmount', () => {
  it('reads as a number of coins', () => {
    const { container } = render(<CoinAmount amount={1240} />);
    expect(container).toHaveTextContent('1,240 coins');
  });

  it('uses the singular for one coin and supports a prefix', () => {
    const { container } = render(<CoinAmount amount={1} prefix="+" />);
    expect(container).toHaveTextContent('+1 coin');
    expect(container).not.toHaveTextContent('coins');
  });

  it('hides the decorative coin icon from screen readers', () => {
    const { container } = render(<CoinAmount amount={5} />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
});
