import { useActionData, useNavigation } from 'react-router';
import type { FormResult } from '@/app/auth/formResult';
import { errorMessages } from '@/domain/errors';

/**
 * The state of a page's form: the last result, which submit button is in progress, and the
 * error message for a given field.
 */
export function useFormState() {
  const result = useActionData<FormResult>();
  const navigation = useNavigation();
  const submittingIntent =
    navigation.state === 'submitting' ? (navigation.formData?.get('intent') ?? 'submit') : null;

  const failure = result && !result.ok ? result : null;
  return {
    result,
    failure,
    /** The message for a problem with the whole form (not tied to one field). */
    formMessage: failure && !failure.field ? errorMessages[failure.error] : null,
    fieldError: (field: string): string | null =>
      failure?.field === field ? errorMessages[failure.error] : null,
    isSubmitting: (intent = 'submit'): boolean => submittingIntent === intent,
  };
}
