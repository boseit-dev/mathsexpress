import { render, screen } from '@testing-library/react';
import { Trophy } from 'lucide-react';
import { describe, expect, it } from 'vitest';
import { Panel } from './Panel';

describe('Panel', () => {
  it('is a section named by its heading', () => {
    render(
      <Panel title="Class leaderboard" icon={Trophy} action={<button type="button">Sort</button>}>
        <p>Content</p>
      </Panel>,
    );
    const section = screen.getByRole('region', { name: 'Class leaderboard' });
    expect(section).toContainElement(screen.getByRole('heading', { level: 2 }));
    expect(section).toContainElement(screen.getByRole('button', { name: 'Sort' }));
    expect(section).toHaveTextContent('Content');
  });
});
