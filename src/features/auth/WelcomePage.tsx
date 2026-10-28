import { Form, useLoaderData } from 'react-router';
import { ChoiceCards } from '@/components/forms/ChoiceCards';
import { FormMessage } from '@/components/forms/FormMessage';
import { PasswordField } from '@/components/forms/PasswordField';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { TextField } from '@/components/forms/TextField';
import { paths } from '@/config/paths';
import type { WelcomeData } from './authHandlers';
import { AuthHeading } from './AuthHeading';
import { roleChoices } from './roleChoices';
import { useFormState } from '@/app/forms/useFormState';
import styles from './AuthPage.module.css';

function SignOutLink() {
  return (
    <Form method="post" action={paths.signOut} className={styles.footer}>
      <button type="submit" className={styles.linkButton}>
        Sign out
      </button>
    </Form>
  );
}

/**
 * Finishes setting up an account: role, name and password. The role is always chosen here (never
 * taken from registration) because it can't be changed afterwards.
 */
export function WelcomePage() {
  const { email, registration, fromEmailLink } = useLoaderData<WelcomeData>();
  const { result, failure, formMessage, fieldError, isSubmitting } = useFormState();
  // Also when the form was sent too late, or the server wants a fresh link.
  const needsLink =
    !fromEmailLink || failure?.error === 'email_link_required' || failure?.error === 'link_invalid';

  if (needsLink) {
    return (
      <>
        <AuthHeading title="Confirm it’s you">
          To finish setting up <strong>{email}</strong>, open the link we email you. It shows that
          the email address is yours.
        </AuthHeading>
        <FormMessage tone="success">{result?.ok ? result.message : null}</FormMessage>
        {/* "Open the link we email you" would only repeat the heading. */}
        <FormMessage tone="error">
          {failure?.error === 'email_link_required' ? null : formMessage}
        </FormMessage>
        <Form method="post" className={styles.form}>
          <SubmitButton
            name="intent"
            value="send-link"
            size="large"
            className={styles.submit}
            pending={isSubmitting('send-link')}
            pendingLabel="Sending…"
          >
            Email me a link
          </SubmitButton>
        </Form>
        <SignOutLink />
      </>
    );
  }

  return (
    <>
      <AuthHeading title="Welcome to MathsExpress">
        Your email address <strong>{email}</strong> is confirmed. Finish setting up your account.
        You can’t change between student and teacher later.
      </AuthHeading>
      <FormMessage tone="error">{formMessage}</FormMessage>
      <Form method="post" noValidate className={styles.form}>
        <ChoiceCards legend="I am a" name="role" choices={roleChoices} error={fieldError('role')} />
        <div className={styles.nameRow}>
          <TextField
            label="First name"
            name="firstName"
            autoComplete="given-name"
            maxLength={50}
            defaultValue={registration.firstName}
            required
            error={fieldError('firstName')}
          />
          <TextField
            label="Last name"
            name="lastName"
            autoComplete="family-name"
            maxLength={50}
            defaultValue={registration.lastName}
            required
            error={fieldError('lastName')}
          />
        </div>
        <PasswordField
          label="Password"
          name="password"
          autoComplete="new-password"
          hint="The password you’ll sign in with: the one you chose when registering, or a new one. 8 to 72 characters, including letters and numbers."
          error={fieldError('password')}
        />
        <SubmitButton
          size="large"
          className={styles.submit}
          pending={isSubmitting()}
          pendingLabel="Setting up…"
        >
          Finish setting up
        </SubmitButton>
      </Form>
      <SignOutLink />
    </>
  );
}
