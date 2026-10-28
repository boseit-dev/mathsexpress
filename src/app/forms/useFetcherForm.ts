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
}

/**
 * A form that sends to the page's action without leaving the page, for pages with several
 * separate forms. Each form keeps its own result and pending state, and when a field needs fixing
 * focus moves to it, so the problem is read out with the field. Inside a LatestFormScope, only
 * the form used last shows its result; pass `onSubmit` to the form for that.
 */
export function useFetcherForm({ key, formRef, resetOnSuccess = false }: FetcherFormOptions = {}) {
  const fetcher = useFetcher<FormResult>(key ? { key } : undefined);
  const scope = use(LatestFormContext);
  const generatedId = useId();
  // Components sharing a fetcher share its result, so they share an id too.
  const formId = key ?? generatedId;
  const data = fetcher.data;
  const result = !scope || scope.latest === formId ? data : undefined;

  useEffect(() => {
    if (!data) return;
    if (data.ok) {
      if (resetOnSuccess) formRef?.current?.reset();
      return;
    }
    if (!data.field) return;
    const field = formRef?.current?.elements.namedItem(data.field);
    if (field instanceof HTMLElement) field.focus();
  }, [data, formRef, resetOnSuccess]);

  return {
    fetcher,
    result,
    ...describeFormResult(result),
    /** The success message of the last submission, if it succeeded. */
    successMessage: result?.ok ? (result.message ?? null) : null,
    isSubmitting: fetcher.state !== 'idle',
    onSubmit: () => {
      scope?.setLatest(formId);
    },
  };
}
