import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { findAccessibilityProblems } from '@/test/axe';
import { createFakeState, testTeacher } from '@/test/fakeDependencies';
import { renderApp } from '@/test/renderApp';

describe('teacher home', () => {
  it('greets the teacher and lists their real classes', async () => {
    renderApp('/teacher', { signedInAs: 'teacher' });
    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: `Good afternoon, ${testTeacher.firstName}`,
      }),
    ).toBeVisible();
    expect(screen.getByText('You teach 1 class with 1 student.')).toBeVisible();
    const classes = screen.getByRole('list', { name: 'Your classes' });
    expect(within(classes).getByRole('link', { name: /9M2 Mathematics/ })).toHaveAttribute(
      'href',
      '/teacher/classes/class-9m2',
    );
  });

  it('offers to create a first class instead of showing empty numbers', async () => {
    const state = createFakeState();
    state.classes = [];
    renderApp('/teacher', { signedInAs: 'teacher', state });
    expect(await screen.findByText('No classes yet')).toBeVisible();
    expect(
      screen.getByText('Create your first class to start teaching with MathsExpress.'),
    ).toBeVisible();
    expect(screen.getAllByRole('link', { name: /Create a class/ })[0]).toHaveAttribute(
      'href',
      '/teacher/classes#create-class',
    );
  });

  it('has no detectable accessibility problems', async () => {
    renderApp('/teacher', { signedInAs: 'teacher' });
    await screen.findByRole('heading', { level: 1 });
    expect(await findAccessibilityProblems()).toEqual([]);
  });
});
