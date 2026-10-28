import { AppError, errorCodeOf, type AppErrorCode } from '@/domain/errors';

/** What a form action returns to its page: success (with an optional message) or an error. */
export type FormResult =
  | { ok: true; message?: string; email?: string }
  | { ok: false; error: AppErrorCode; field?: string };

export function formError(error: AppErrorCode, field?: string): FormResult {
  return field ? { ok: false, error, field } : { ok: false, error };
}

/**
 * Runs a form's work and turns expected problems (AppError) into a FormResult for the page.
 * Redirects and unexpected errors are rethrown, so the router and error pages handle them.
 */
export async function runForm(work: () => Promise<FormResult>): Promise<FormResult> {
  try {
    return await work();
  } catch (error) {
    if (error instanceof AppError) return formError(errorCodeOf(error));
    throw error;
  }
}

export function readText(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === 'string' ? value : '';
}
