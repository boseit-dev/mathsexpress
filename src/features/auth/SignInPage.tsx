import { Form, Link } from 'react-router';
import { FormMessage } from '@/components/forms/FormMessage';
import { PasswordField } from '@/components/forms/PasswordField';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { TextField } from '@/components/forms/TextField';
import { paths } from '@/config/paths';
import { AuthHeading } from './AuthHeading';
import { GoogleButton } from './GoogleButton';
import { useFormState } from '@/app/forms/useFormState';
import styles from './AuthPage.module.css';

const FORM_ID = 'sign-in-form';

export function SignInPage() {
  const { result, failure, formMessage, fieldError, isSubmitting } = useFormState();
  const needsConfirmation = failure?.error === 'email_not_confirmed';

  return (
    <>
      <AuthHeading title="Sign in">Welcome back to MathsExpress.</AuthHeading>

      {result?.ok && result.message && <FormMessage tone="success">{result.message}</FormMessage>}
      {formMessage && (
        <FormMessage tone="error">
          <p>{formMessage}</p>
          {needsConfirmation && (
            <button
              type="submit"
              form={FORM_ID}
              name="intent"
              value="resend"
              className={styles.linkButton}
            >
              Send the confirmation email again
            </button>
          )}
        </FormMessage>
      )}

      <Form method="post" noValidate id={FORM_ID} className={styles.form}>
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={fieldError('email')}
        />
        <PasswordField
          label="Password"
          name="password"
          autoComplete="current-password"
          error={fieldError('password')}
        />
        <Link to={paths.forgotPassword} className={styles.inlineLink}>
          Forgot your password?
        </Link>
        <SubmitButton
          name="intent"
          value="submit"
          size="large"
          className={styles.submit}
          pending={isSubmitting()}
          pendingLabel="Signing in…"
        >
          Sign in
        </SubmitButton>
      </Form>

      <p className={styles.divider}>or</p>
      <Form method="post">
        <GoogleButton label="Continue with Google" pending={isSubmitting('google')} />
      </Form>

      <p className={styles.footer}>
        New to MathsExpress? <Link to={paths.register}>Create an account</Link>
      </p>
    </>
  );
}
