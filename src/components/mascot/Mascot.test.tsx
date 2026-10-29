import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { mascotPalette } from '@/assets/mascot/palette';
import { findAccessibilityProblems } from '@/test/axe';
import { animationNames, animationPose, mascotAnimations } from './animations';
import { expressionNames } from './expressions';
import { Mascot } from './Mascot';
import { mascotViews, poseNames, poses } from './poses';
import css from './Mascot.module.css?raw';

const characterColours = new Set<string>(Object.values(mascotPalette));

/** Every fill used by the capybara itself (not its props or effects). */
function characterFills(svg: Element): string[] {
  const parts = svg.querySelectorAll('[data-p="torso"], [data-p^="leg-"]');
  return [...parts].flatMap((part) =>
    [...part.querySelectorAll('[fill]')]
      .filter((shape) => !shape.closest('[data-prop]'))
      .map((shape) => shape.getAttribute('fill') ?? '')
      // Eyebrows and closed eyes are strokes with no fill.
      .filter((fill) => fill !== 'none'),
  );
}

describe('Mascot', () => {
  it('is decorative by default and named when given a label', () => {
    const { container, rerender } = render(<Mascot pose="standing" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    rerender(<Mascot pose="waving" label="The MathsExpress capybara waving hello" />);
    expect(
      screen.getByRole('img', { name: 'The MathsExpress capybara waving hello' }),
    ).toBeInTheDocument();
  });

  it.each(poseNames)('draws the %s pose from the shared palette, with no mouth', (name) => {
    const { container } = render(<Mascot pose={name} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    if (!svg) return;
    expect(svg.querySelector('[data-p="head"]')).not.toBeNull();
    expect(svg.querySelector('[data-part="mouth"], [data-p="mouth"]')).toBeNull();
    for (const fill of characterFills(svg)) expect(characterColours).toContain(fill);
  });

  it.each(mascotViews)('draws the %s view', (view) => {
    const { container } = render(<Mascot pose="standing" view={view} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('data-view', view);
    const mirrored = svg?.querySelector('g[transform^="matrix(-1"]');
    expect(Boolean(mirrored)).toBe(view.endsWith('left'));
  });

  it('shows every expression without changing the body', () => {
    const shapesFor = (expression: (typeof expressionNames)[number]) => {
      const { container, unmount } = render(<Mascot pose="standing" expression={expression} />);
      const body = container.querySelector('[data-p="torso"] path')?.getAttribute('d');
      unmount();
      return body;
    };
    const bodies = new Set(expressionNames.map(shapesFor));
    expect(bodies.size).toBe(1);
  });

  it.each(animationNames)('has keyframe rules and a valid pose for the %s animation', (name) => {
    // Idle is the resting breathing and blinking that every ambient animation shares.
    if (name === 'idle') expect(css).toContain("[data-ambient='on'] [data-p='torso']");
    else expect(css).toContain(`[data-animation='${name}']`);
    expect(animationPose(name).arms).toBeDefined();
    expect(mascotAnimations[name].cycleMs).toBeGreaterThan(0);
  });

  it('marks the animation, its cycle length and reduced motion on the drawing', () => {
    const { container, rerender } = render(<Mascot animation="correct" cycles={1} />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('data-animation', 'correct');
    expect(svg?.getAttribute('style')).toContain('--cycle: 1300ms');
    expect(svg?.getAttribute('style')).toContain('--iterations: 1');
    rerender(<Mascot animation="correct" motion="reduce" />);
    expect(container.querySelector('svg')).toHaveAttribute('data-motion', 'reduce');
  });

  it('turns off every animation for visitors who prefer reduced motion', () => {
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.root,\s*\.root \*\s*\{\s*animation: none !important;/,
    );
  });

  it('covers all 24 animations and every requested pose', () => {
    expect(animationNames).toHaveLength(24);
    for (const pose of [
      'standing',
      'waving',
      'walking',
      'running',
      'jumping',
      'sitting',
      'lyingDown',
      'sleeping',
      'reading',
      'calculator',
      'pointing',
      'teaching',
      'thinking',
      'confused',
      'celebrating',
      'clapping',
      'thumbsUp',
      'medal',
      'certificate',
      'writing',
      'laptop',
      'peeking',
    ]) {
      expect(poses).toHaveProperty(pose);
    }
  });

  it('has no accessibility problems when labelled', async () => {
    render(
      <div>
        <Mascot animation="wave" label="The MathsExpress capybara waving" />
        <Mascot pose="teaching" />
      </div>,
    );
    expect(await findAccessibilityProblems()).toEqual([]);
  });
});
