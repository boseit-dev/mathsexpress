import { useEffect } from 'react';
import { useActionData, useNavigation } from 'react-router';
import { MAIN_CONTENT_ID } from '../mainContentFocus';
import { describeFormResult, type FormResult } from './formResult';

/**
 * The state of a page's form: the last result, which submit button is in progress, and the
 * error message for a given field. For pages with several separate forms, use useFetcherForm.
 *
 * After each result, focus moves to the field that needs fixing, so its error is read out with
 * it, or otherwise to the page's main content, which may have changed (e.g. "Check your email").
 */
export function useFormState() {
  const result = useActionData<FormResult>();
  const navigation = useNavigation();
  const submittingIntent =
    navigation.state === 'submitting' ? (navigation.formData?.get('intent') ?? 'submit') : null;
  const feedback = describeFormResult(result);
  const invalidField = feedback.failure?.field;

  useEffect(() => {
    if (!result) return;
    const main = document.getElementById(MAIN_CONTENT_ID);
    const field = invalidField ? main?.querySelector(`[name="${invalidField}"]`) : null;
    if (field instanceof HTMLElement) field.focus();
    else main?.focus({ preventScroll: true });
  }, [result, invalidField]);

  return {
    result,
    ...feedback,
    isSubmitting: (intent = 'submit'): boolean => submittingIntent === intent,
  };
}
