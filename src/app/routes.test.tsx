import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { StudentRepository } from '@/data/repositories';
import { sampleStudent } from '@/data/sample/sampleStudent';
import { findAccessibilityProblems } from '@/test/axe';
import { renderApp } from '@/test/renderApp';

function linkNames(container: HTMLElement) {
  return within(container)
    .getAllByRole('link')
    .map((link) => link.textContent);
}

describe('routing', () => {
  it('sends the root address to the student home', async () => {
    const { router } = renderApp('/');
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/student');
    });
  });

  it('shows a not-found page for an unknown address', async () => {
    renderApp('/no-such-page');
    expect(await screen.findByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
    expect(screen.getByRole('link', { name: 'Go to home' })).toHaveAttribute('href', '/');
  });
});

describe('student layout', () => {
  it('shows the student navigation at the top in the agreed order', async () => {
    renderApp('/student');
    const nav = await screen.findByRole('navigation', { name: 'Student' });
    expect(screen.getByRole('banner')).toContainElement(nav);
    expect(linkNames(nav)).toEqual(['Home', 'Learn', 'Textbook', 'Class', 'More']);
    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });

  it('navigates between sections and moves focus to the new page', async () => {
    const user = userEvent.setup();
    renderApp('/student');
    const nav = await screen.findByRole('navigation', { name: 'Student' });

    await user.click(within(nav).getByRole('link', { name: 'Learn' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Learn' })).toBeVisible();
    expect(within(nav).getByRole('link', { name: 'Learn' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(nav).getByRole('link', { name: 'Home' })).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('main')).toHaveFocus();
    expect(document.title).toBe('Learn · MathsExpress');
  });

  it('shows the student’s coin balance and avatar', async () => {
    renderApp('/student');
    const header = await screen.findByRole('banner');
    expect(header).toHaveTextContent('Coin balance: 340 coins');
    expect(within(header).getByRole('img', { name: 'Mia Chen' })).toBeVisible();
  });

  it('labels the preview as sample data and links to the teacher layout', async () => {
    renderApp('/student');
    const notice = await screen.findByRole('complementary', { name: 'Development preview' });
    expect(notice).toHaveTextContent('Sample data only: these are not real students or teachers.');
    expect(within(notice).getByRole('link', { name: 'View the teacher layout' })).toHaveAttribute(
      'href',
      '/teacher',
    );
  });

  it('offers a skip link as the first stop for keyboard users', async () => {
    const user = userEvent.setup();
    renderApp('/student');
    await screen.findByRole('navigation', { name: 'Student' });
    await user.tab();
    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
    expect(skipLink).toHaveFocus();
    expect(skipLink).toHaveAttribute('href', '#main-content');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
  });

  it('keeps the navigation when an address inside the student area does not exist', async () => {
    renderApp('/student/no-such-page');
    expect(await screen.findByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
    expect(screen.getByRole('navigation', { name: 'Student' })).toBeVisible();
  });

  it('has no detectable accessibility problems', async () => {
    renderApp('/student/learn');
    await screen.findByRole('heading', { level: 1, name: 'Learn' });
    expect(await findAccessibilityProblems()).toEqual([]);
  });
});

describe('teacher layout', () => {
  it('shows the teacher navigation at the top in the agreed order', async () => {
    renderApp('/teacher');
    const nav = await screen.findByRole('navigation', { name: 'Teacher' });
    const header = screen.getByRole('banner');
    expect(header).toContainElement(nav);
    expect(linkNames(nav)).toEqual(['Home', 'Classes', 'Tasks', 'Reports', 'More']);
    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(within(header).getByRole('img', { name: 'Priya Patel' })).toBeVisible();
  });

  it('offers "Back to home" on planned sections but not on the home page itself', async () => {
    const { router } = renderApp('/teacher/tasks');
    expect(await screen.findByRole('link', { name: 'Back to home' })).toHaveAttribute(
      'href',
      '/teacher',
    );

    await router.navigate('/teacher');

    expect(await screen.findByRole('heading', { level: 1, name: 'Teacher home' })).toBeVisible();
    expect(screen.queryByRole('link', { name: 'Back to home' })).not.toBeInTheDocument();
  });

  it('has no detectable accessibility problems', async () => {
    renderApp('/teacher/reports');
    await screen.findByRole('heading', { level: 1, name: 'Reports' });
    expect(await findAccessibilityProblems()).toEqual([]);
  });
});

describe('errors', () => {
  it('shows an error page whose Try again button reloads the data', async () => {
    const user = userEvent.setup();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const getCurrentStudent = vi
      .fn<StudentRepository['getCurrentStudent']>()
      .mockRejectedValueOnce(new Error('Network unavailable'))
      .mockResolvedValue(sampleStudent);

    renderApp('/student/learn', { studentRepository: { getCurrentStudent } });

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Something went wrong' }),
    ).toBeVisible();
    expect(consoleError).toHaveBeenCalledWith(
      'MathsExpress could not show this page:',
      expect.any(Error),
    );

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Learn' })).toBeVisible();
    expect(getCurrentStudent).toHaveBeenCalledTimes(2);
  });
});
