import { Form, Link, useLoaderData } from 'react-router';
import { FormMessage } from '@/components/forms/FormMessage';
import { PasswordField } from '@/components/forms/PasswordField';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { paths } from '@/config/paths';
import { errorMessages } from '@/domain/errors';
import { AuthHeading } from './AuthHeading';
import { useFormState } from '@/app/forms/useFormState';
import styles from './AuthPage.module.css';

export function ResetPasswordPage() {
  const { signedIn } = useLoaderData<{ signedIn: boolean }>();
  const { result, formMessage, fieldError, isSubmitting } = useFormState();

  if (!signedIn) {
    return (
      <>
        <AuthHeading title="Reset your password" />
        <FormMessage tone="error">{errorMessages.link_invalid}</FormMessage>
        <ButtonLink to={paths.forgotPassword} className={styles.submit}>
          Request a new link
        </ButtonLink>
      </>
    );
  }

  if (result?.ok) {
    return (
      <>
        <AuthHeading title="Password changed" />
        <FormMessage tone="success">Your password has been changed.</FormMessage>
        <ButtonLink to={paths.root} size="large" className={styles.submit}>
          Continue to MathsExpress
        </ButtonLink>
      </>
    );
  }

  return (
    <>
      <AuthHeading title="Choose a new password" />
      {formMessage && <FormMessage tone="error">{formMessage}</FormMessage>}
      <Form method="post" noValidate className={styles.form}>
        <PasswordField
          label="New password"
          name="password"
          autoComplete="new-password"
          hint="At least 8 characters, including letters and numbers."
          error={fieldError('password')}
        />
        <PasswordField
          label="Confirm new password"
          name="confirmPassword"
          autoComplete="new-password"
          error={fieldError('confirmPassword')}
        />
        <SubmitButton
          size="large"
          className={styles.submit}
          pending={isSubmitting()}
          pendingLabel="Saving…"
        >
          Save new password
        </SubmitButton>
      </Form>
      <p className={styles.footer}>
        <Link to={paths.root}>Cancel</Link>
      </p>
    </>
  );
}
