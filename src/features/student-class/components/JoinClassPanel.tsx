import { useRef } from 'react';
import { KeyRound } from 'lucide-react';
import { useFetcherForm } from '@/app/forms/useFetcherForm';
import { FormMessage } from '@/components/forms/FormMessage';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { TextField } from '@/components/forms/TextField';
import { Panel } from '@/components/ui/Panel';
import styles from './JoinClassPanel.module.css';

/** Joining a class with the code from its teacher. */
export function JoinClassPanel() {
  const formRef = useRef<HTMLFormElement>(null);
  const join = useFetcherForm({ formRef, resetOnSuccess: true });

  return (
    <Panel title="Join a class" icon={KeyRound} className={styles.panel}>
      <p className={styles.intro}>
        Your teacher will give you a class code. It has 8 letters and numbers.
      </p>
      <FormMessage tone="success">{join.successMessage}</FormMessage>
      <FormMessage tone="error">{join.formMessage}</FormMessage>
      <join.fetcher.Form
        method="post"
        onSubmit={join.onSubmit}
        ref={formRef}
        noValidate
        className={styles.form}
      >
        <TextField
          label="Class code"
          name="code"
          hint="For example ABCD-2345"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          maxLength={12}
          required
          error={join.fieldError('code')}
          className={styles.codeField}
        />
        <SubmitButton
          name="intent"
          value="join"
          pending={join.isSubmitting}
          pendingLabel="Joining…"
        >
          Join class
        </SubmitButton>
      </join.fetcher.Form>
    </Panel>
  );
}
