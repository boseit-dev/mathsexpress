import { Form, Link } from 'react-router';
import { FormMessage } from '@/components/forms/FormMessage';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { TextField } from '@/components/forms/TextField';
import { paths } from '@/config/paths';
import { AuthHeading } from './AuthHeading';
import { useFormState } from './useFormState';
import styles from './AuthPage.module.css';

export function ForgotPasswordPage() {
  const { result, formMessage, fieldError, isSubmitting } = useFormState();

  return (
    <>
      <AuthHeading title="Reset your password">
        Enter the email address for your account and we’ll send you a link to choose a new password.
      </AuthHeading>

      {result?.ok && result.email ? (
        <FormMessage tone="success">
          If an account uses <strong>{result.email}</strong>, we’ve sent it a password reset link.
          The link can be used once.
        </FormMessage>
      ) : (
        <>
          {formMessage && <FormMessage tone="error">{formMessage}</FormMessage>}
          <Form method="post" noValidate className={styles.form}>
            <TextField
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
              error={fieldError('email')}
            />
            <SubmitButton
              size="large"
              className={styles.submit}
              pending={isSubmitting()}
              pendingLabel="Sending…"
            >
              Send reset link
            </SubmitButton>
          </Form>
        </>
      )}

      <p className={styles.footer}>
        Remembered it? <Link to={paths.signIn}>Back to sign in</Link>
      </p>
    </>
  );
}
