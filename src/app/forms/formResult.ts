import { AppError, errorCodeOf, errorMessages, type AppErrorCode } from '@/domain/errors';

/** What a form action returns to its page: success (with an optional message) or an error. */
export type FormResult =
  | { ok: true; message?: string; email?: string }
  | { ok: false; error: AppErrorCode; field?: string; email?: string };

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

/** The messages to show for a result: one for the whole form, or one for a given field. */
export function describeFormResult(result: FormResult | undefined) {
  const failure = result && !result.ok ? result : null;
  return {
    failure,
    /** The message for a problem with the whole form (not tied to one field). */
    formMessage: failure && !failure.field ? errorMessages[failure.error] : null,
    fieldError: (field: string): string | null =>
      failure?.field === field ? errorMessages[failure.error] : null,
  };
}

export function readText(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === 'string' ? value : '';
}
