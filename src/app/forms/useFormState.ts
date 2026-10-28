import { useActionData, useNavigation } from 'react-router';
import { describeFormResult, type FormResult } from './formResult';

/**
 * The state of a page's form: the last result, which submit button is in progress, and the
 * error message for a given field. For pages with several separate forms, use useFetcherForm.
 */
export function useFormState() {
  const result = useActionData<FormResult>();
  const navigation = useNavigation();
  const submittingIntent =
    navigation.state === 'submitting' ? (navigation.formData?.get('intent') ?? 'submit') : null;

  return {
    result,
    ...describeFormResult(result),
    isSubmitting: (intent = 'submit'): boolean => submittingIntent === intent,
  };
}
