import { Form, Link } from 'react-router';
import { ChoiceCards } from '@/components/forms/ChoiceCards';
import { FormMessage } from '@/components/forms/FormMessage';
import { PasswordField } from '@/components/forms/PasswordField';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { TextField } from '@/components/forms/TextField';
import { paths } from '@/config/paths';
import { AuthHeading } from './AuthHeading';
import { GoogleButton } from './GoogleButton';
import { roleChoices } from './roleChoices';
import { useFormState } from '@/app/forms/useFormState';
import styles from './AuthPage.module.css';

export function RegisterPage() {
  const { result, formMessage, fieldError, isSubmitting } = useFormState();

  if (result?.ok && result.email) {
    return (
      <>
        <AuthHeading title="Check your email">
          We sent a link to <strong>{result.email}</strong>. Open it to confirm your email address
          and finish creating your account.
        </AuthHeading>
        {result.message && <FormMessage tone="success">{result.message}</FormMessage>}
        <Form method="post" className={styles.form}>
          <input type="hidden" name="email" value={result.email} />
          <SubmitButton
            name="intent"
            value="resend"
            variant="secondary"
            pending={isSubmitting('resend')}
            pendingLabel="Sending…"
          >
            Send the email again
          </SubmitButton>
        </Form>
        <p className={styles.footer}>
          Already confirmed? <Link to={paths.signIn}>Sign in</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <AuthHeading title="Create your account">
        Students join their class with a code from their teacher.
      </AuthHeading>

      {formMessage && <FormMessage tone="error">{formMessage}</FormMessage>}

      <Form method="post" noValidate className={styles.form}>
        <ChoiceCards legend="I am a" name="role" choices={roleChoices} error={fieldError('role')} />
        <div className={styles.nameRow}>
          <TextField
            label="First name"
            name="firstName"
            autoComplete="given-name"
            maxLength={50}
            required
            error={fieldError('firstName')}
          />
          <TextField
            label="Last name"
            name="lastName"
            autoComplete="family-name"
            maxLength={50}
            required
            error={fieldError('lastName')}
          />
        </div>
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
          autoComplete="new-password"
          hint="At least 8 characters, including letters and numbers."
          error={fieldError('password')}
        />
        <SubmitButton
          name="intent"
          value="submit"
          size="large"
          className={styles.submit}
          pending={isSubmitting()}
          pendingLabel="Creating your account…"
        >
          Create account
        </SubmitButton>
      </Form>

      <p className={styles.divider}>or</p>
      <Form method="post">
        <GoogleButton label="Sign up with Google" pending={isSubmitting('google')} />
      </Form>

      <p className={styles.footer}>
        Already have an account? <Link to={paths.signIn}>Sign in</Link>
      </p>
    </>
  );
}
