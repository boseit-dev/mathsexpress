import { act, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { AppError } from '@/domain/errors';
import { findAccessibilityProblems } from '@/test/axe';
import {
  createFakeDependencies,
  createFakeState,
  endSessionElsewhere,
} from '@/test/fakeDependencies';
import { renderApp } from '@/test/renderApp';

function linkNames(container: HTMLElement) {
  return within(container)
    .getAllByRole('link')
    .map((link) => link.textContent);
}

describe('where people start', () => {
  it('sends visitors who are not signed in to sign in', async () => {
    const { router } = renderApp('/', { signedInAs: null });
    expect(await screen.findByRole('heading', { level: 1, name: 'Sign in' })).toBeVisible();
    expect(router.state.location.pathname).toBe('/sign-in');
  });

  it('sends students and teachers to their own home page', async () => {
    const student = renderApp('/', { signedInAs: 'student' });
    await waitFor(() => {
      expect(student.router.state.location.pathname).toBe('/student');
    });
    student.unmount();

    const teacher = renderApp('/', { signedInAs: 'teacher' });
    await waitFor(() => {
      expect(teacher.router.state.location.pathname).toBe('/teacher');
    });
  });

  it('asks signed-in people without a profile to finish setting up', async () => {
    const state = createFakeState();
    const account = state.accounts.get('mia@example.test');
    if (account) account.profile = null;
    const { router } = renderApp('/', { state });
    // Signed in with a password, so they're first asked to prove the email address is theirs.
    expect(
      await screen.findByRole('heading', { level: 1, name: 'Confirm it’s you' }),
    ).toBeVisible();
    expect(router.state.location.pathname).toBe('/welcome');
  });

  it('shows a not-found page for an unknown address', async () => {
    renderApp('/no-such-page');
    expect(await screen.findByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
  });
});

describe('who can see which pages', () => {
  it('sends signed-out visitors to sign in and remembers where they were going', async () => {
    const { router } = renderApp('/student/class', { signedInAs: null });
    await screen.findByRole('heading', { level: 1, name: 'Sign in' });
    expect(router.state.location.search).toBe('?redirectTo=%2Fstudent%2Fclass');
  });

  it('keeps students out of teacher pages and teachers out of student pages', async () => {
    const student = renderApp('/teacher/classes', { signedInAs: 'student' });
    await waitFor(() => {
      expect(student.router.state.location.pathname).toBe('/student');
    });
    student.unmount();

    const teacher = renderApp('/student/class', { signedInAs: 'teacher' });
    await waitFor(() => {
      expect(teacher.router.state.location.pathname).toBe('/teacher');
    });
  });

  it('sends signed-in people away from the sign-in page', async () => {
    const { router } = renderApp('/sign-in', { signedInAs: 'student' });
    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/student');
    });
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
    await waitFor(() => {
      expect(screen.getByRole('main')).toHaveFocus();
      expect(document.title).toBe('Learn · MathsExpress');
    });
  });

  it('marks a parent section, not the current page, on pages inside it', async () => {
    renderApp('/student/class/tasks');
    const nav = await screen.findByRole('navigation', { name: 'Student' });
    expect(within(nav).getByRole('link', { name: 'Class' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    expect(within(nav).queryByRole('link', { current: 'page' })).not.toBeInTheDocument();
  });

  it('does not show the old development-preview banner', async () => {
    renderApp('/student');
    await screen.findByRole('heading', { level: 1 });
    expect(
      screen.queryByRole('complementary', { name: 'Development preview' }),
    ).not.toBeInTheDocument();
  });

  it('offers a skip link as the first stop for keyboard users', async () => {
    const user = userEvent.setup();
    renderApp('/student');
    await screen.findByRole('navigation', { name: 'Student' });
    await user.tab();
    const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
    expect(skipLink).toHaveFocus();
    expect(skipLink).toHaveAttribute('href', '#main-content');
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

describe('account menu and signing out', () => {
  it('shows who is signed in and signs them out', async () => {
    const user = userEvent.setup();
    const { router, state } = renderApp('/student');
    const menuButton = await screen.findByRole('button', { name: 'Account: Mia Chen' });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');

    await user.click(menuButton);
    expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Student account')).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Sign out' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Sign in' })).toBeVisible();
    expect(router.state.location.pathname).toBe('/sign-in');
    expect(state.signedInEmail).toBeNull();
  });

  it('closes with Escape and returns focus to the button', async () => {
    const user = userEvent.setup();
    renderApp('/teacher', { signedInAs: 'teacher' });
    const menuButton = await screen.findByRole('button', { name: 'Account: Priya Patel' });
    await user.click(menuButton);
    await user.keyboard('{Escape}');
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(menuButton).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Sign out' })).not.toBeInTheDocument();
  });

  it('leaves protected pages when the session ends in another tab', async () => {
    const { state, router } = renderApp('/student/learn');
    await screen.findByRole('heading', { level: 1, name: 'Learn' });

    act(() => {
      endSessionElsewhere(state);
    });

    expect(await screen.findByRole('heading', { level: 1, name: 'Sign in' })).toBeVisible();
    expect(router.state.location.search).toBe('?redirectTo=%2Fstudent%2Flearn');
  });
});

describe('teacher layout', () => {
  it('shows the teacher navigation at the top in the agreed order', async () => {
    renderApp('/teacher', { signedInAs: 'teacher' });
    const nav = await screen.findByRole('navigation', { name: 'Teacher' });
    expect(screen.getByRole('banner')).toContainElement(nav);
    expect(linkNames(nav)).toEqual(['Home', 'Classes', 'Tasks', 'Reports', 'More']);
    expect(within(nav).getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
  });

  it('offers "Back to home" on planned sections but not on the home page itself', async () => {
    const { router } = renderApp('/teacher/tasks', { signedInAs: 'teacher' });
    expect(await screen.findByRole('link', { name: 'Back to home' })).toHaveAttribute(
      'href',
      '/teacher',
    );
    await router.navigate('/teacher');
    expect(await screen.findByRole('heading', { level: 1, name: 'Teacher home' })).toBeVisible();
    expect(screen.queryByRole('link', { name: 'Back to home' })).not.toBeInTheDocument();
  });

  it('has no detectable accessibility problems', async () => {
    renderApp('/teacher/reports', { signedInAs: 'teacher' });
    await screen.findByRole('heading', { level: 1, name: 'Reports' });
    expect(await findAccessibilityProblems()).toEqual([]);
  });
});

describe('errors', () => {
  it('moves focus to the new page after "Go to home" on the not-found page', async () => {
    const user = userEvent.setup();
    renderApp('/no-such-page');
    await user.click(await screen.findByRole('link', { name: 'Go to home' }));
    await screen.findByRole('navigation', { name: 'Student' });
    await waitFor(() => {
      expect(screen.getByRole('main')).toHaveFocus();
    });
  });

  it('moves focus to the page after "Go to home" on an error shown at the same address', async () => {
    const user = userEvent.setup();
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const state = createFakeState();
    const realClasses = createFakeDependencies(state).classes;
    const listMyClasses = vi
      .fn<typeof realClasses.listMyClasses>()
      .mockRejectedValueOnce(new AppError('network'))
      .mockImplementation((options) => realClasses.listMyClasses(options));
    renderApp('/student', { state, overrides: { classes: { ...realClasses, listMyClasses } } });

    await user.click(await screen.findByRole('link', { name: 'Go to home' }));
    expect(await screen.findByRole('heading', { level: 1, name: /Mia/ })).toBeVisible();
    await waitFor(() => {
      expect(screen.getByRole('main')).toHaveFocus();
    });
  });

  it('opens pages that don’t show classes even when loading the classes fails', async () => {
    const user = userEvent.setup();
    const state = createFakeState();
    const realClasses = createFakeDependencies(state).classes;
    const listMyClasses = vi
      .fn<typeof realClasses.listMyClasses>()
      .mockImplementationOnce((options) => realClasses.listMyClasses(options))
      .mockRejectedValue(new AppError('network'));
    renderApp('/student', { state, overrides: { classes: { ...realClasses, listMyClasses } } });
    await screen.findByRole('heading', { level: 1, name: /Mia/ });

    await user.click(screen.getByRole('link', { name: 'Textbook' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Textbook' })).toBeVisible();
    expect(screen.getByRole('navigation', { name: 'Student' })).toBeVisible();
  });

  it('shows an error page whose Try again button reloads the data', async () => {
    const user = userEvent.setup();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const state = createFakeState();
    const realClasses = createFakeDependencies(state).classes;
    const listMyClasses = vi
      .fn<typeof realClasses.listMyClasses>()
      .mockRejectedValueOnce(new AppError('network'))
      .mockImplementation((options) => realClasses.listMyClasses(options));

    renderApp('/student/learn', {
      state,
      overrides: { classes: { ...realClasses, listMyClasses } },
    });

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Something went wrong' }),
    ).toBeVisible();
    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        'MathsExpress could not show this page:',
        expect.any(AppError),
      );
    });

    await user.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Learn' })).toBeVisible();
    expect(listMyClasses).toHaveBeenCalledTimes(2);
    await waitFor(() => {
      expect(screen.getByRole('main')).toHaveFocus();
    });
  });
});
