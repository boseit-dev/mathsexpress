import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { paths } from '@/config/paths';
import { renderApp } from '@/test/renderApp';

describe('More pages', () => {
  it('offers working student study links and a controllable focus timer', async () => {
    const user = userEvent.setup();
    renderApp(paths.student.more);
    expect(await screen.findByRole('heading', { level: 1, name: 'More' })).toBeVisible();
    const tools = screen.getByRole('navigation', { name: 'Student tools' });
    expect(within(tools).getByRole('link', { name: /My assignments/ })).toHaveAttribute('href', paths.student.tasks);
    expect(within(tools).getByRole('link', { name: /My collection/ })).toHaveAttribute('href', paths.student.shopCollection);
    expect(screen.getByText('15:00')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '5 min' }));
    expect(screen.getByText('05:00')).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Start focus' }));
    expect(screen.getByRole('button', { name: 'Pause' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Pause' }));
    expect(screen.getByRole('button', { name: 'Reset' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    expect(screen.getByText('05:00')).toBeVisible();
  });

  it('has real navigation destinations for teachers', async () => {
    renderApp(paths.teacher.more, { signedInAs: 'teacher' });
    expect(await screen.findByRole('heading', { level: 1, name: 'More' })).toBeVisible();
    const tools = screen.getByRole('navigation', { name: 'Teacher tools' });
    expect(within(tools).getByRole('link', { name: /Manage classes/ })).toHaveAttribute('href', paths.teacher.classes);
    expect(within(tools).getByRole('link', { name: /Class reports/ })).toHaveAttribute('href', paths.teacher.reports);
  });
});
