import { Form, useLoaderData } from 'react-router';
import { ChoiceCards } from '@/components/forms/ChoiceCards';
import { FormMessage } from '@/components/forms/FormMessage';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { TextField } from '@/components/forms/TextField';
import { paths } from '@/config/paths';
import type { WelcomeData } from './authHandlers';
import { AuthHeading } from './AuthHeading';
import { roleChoices } from './roleChoices';
import { useFormState } from './useFormState';
import styles from './AuthPage.module.css';

/** Finishes setting up an account: role and name. The role cannot be changed afterwards. */
export function WelcomePage() {
  const { email, registration } = useLoaderData<WelcomeData>();
  const { formMessage, fieldError, isSubmitting } = useFormState();

  return (
    <>
      <AuthHeading title="Welcome to MathsExpress">
        You’re signed in as <strong>{email}</strong>. Tell us a little about yourself to finish
        setting up your account.
      </AuthHeading>
      {formMessage && <FormMessage tone="error">{formMessage}</FormMessage>}
      <Form method="post" noValidate className={styles.form}>
        <ChoiceCards
          legend="I am a"
          name="role"
          choices={roleChoices}
          defaultValue={registration.role}
          error={fieldError('role')}
        />
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
        <SubmitButton
          size="large"
          className={styles.submit}
          pending={isSubmitting()}
          pendingLabel="Setting up…"
        >
          Finish setting up
        </SubmitButton>
      </Form>
      <Form method="post" action={paths.signOut} className={styles.footer}>
        <button type="submit" className={styles.linkButton}>
          Sign out
        </button>
      </Form>
    </>
  );
}
