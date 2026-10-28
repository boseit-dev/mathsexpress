import { use, useEffect, useId, type RefObject } from 'react';
import { useFetcher } from 'react-router';
import { describeFormResult, type FormResult } from './formResult';
import { LatestFormContext } from './latestFormContext';

interface FetcherFormOptions {
  /** Share one fetcher between components, e.g. a list's rows and the page that announces results. */
  key?: string;
  /** The form element, so focus can move to a field that needs fixing. */
  formRef?: RefObject<HTMLFormElement | null>;
  /** Clear the form after it succeeds, e.g. so a join code isn't left in the box. */
  resetOnSuccess?: boolean;
  /**
   * Where focus goes after a success if it was lost, e.g. because the saved data rebuilt the
   * form and removed the button that was pressed.
   */
  focusAfterSuccess?: RefObject<HTMLElement | null>;
}

/** True when nothing has focus, e.g. after the focused element was removed from the page. */
function focusWasLost(): boolean {
  return document.activeElement === null || document.activeElement === document.body;
}

/**
 * A form that sends to the page's action without leaving the page, for pages with several
 * separate forms. Each form keeps its own result and pending state, and when a field needs fixing
 * focus moves to it, so the problem is read out with the field. A result shows only once the
 * page's data has reloaded, never the previous one while a new submission is on its way. Inside
 * a LatestFormScope, only the form used last shows its result; pass `onSubmit` to the form.
 */
export function useFetcherForm({
  key,
  formRef,
  resetOnSuccess = false,
  focusAfterSuccess,
}: FetcherFormOptions = {}) {
  const fetcher = useFetcher<FormResult>(key ? { key } : undefined);
  const scope = use(LatestFormContext);
  const generatedId = useId();
  // Components sharing a fetcher share its result, so they share an id too.
  const formId = key ?? generatedId;
  const isIdle = fetcher.state === 'idle';
  const settled = isIdle ? fetcher.data : undefined;
  const result = !scope || scope.latest === formId ? settled : undefined;

  useEffect(() => {
    if (!settled) return;
    if (settled.ok) {
      if (resetOnSuccess) formRef?.current?.reset();
      if (focusWasLost()) focusAfterSuccess?.current?.focus();
      return;
    }
    if (!settled.field) return;
    const field = formRef?.current?.elements.namedItem(settled.field);
    if (field instanceof HTMLElement) field.focus();
  }, [settled, formRef, resetOnSuccess, focusAfterSuccess]);

  return {
    fetcher,
    result,
    ...describeFormResult(result),
    /** The success message of the last submission, if it succeeded. */
    successMessage: result?.ok ? (result.message ?? null) : null,
    isSubmitting: !isIdle,
    onSubmit: () => {
      scope?.setLatest(formId);
    },
  };
}
