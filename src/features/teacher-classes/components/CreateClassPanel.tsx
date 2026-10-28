import { useRef } from 'react';
import { Plus } from 'lucide-react';
import { useFetcherForm } from '@/app/forms/useFetcherForm';
import { FormMessage } from '@/components/forms/FormMessage';
import { SelectField } from '@/components/forms/SelectField';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { TextField } from '@/components/forms/TextField';
import { Panel } from '@/components/ui/Panel';
import { yearLevelOptions } from '@/features/classes/yearLevelOptions';
import styles from './ClassForms.module.css';

const CHOOSE_YEAR = { value: '', label: 'Choose a year level' };

/** Creating a class. Success opens the new class's page (the action redirects there). */
export function CreateClassPanel() {
  const formRef = useRef<HTMLFormElement>(null);
  const create = useFetcherForm({ formRef });

  return (
    <Panel title="Create a class" icon={Plus}>
      {create.formMessage && <FormMessage tone="error">{create.formMessage}</FormMessage>}
      <create.fetcher.Form method="post" ref={formRef} noValidate className={styles.form}>
        <TextField
          label="Class name"
          name="name"
          hint="For example 9M2 Mathematics"
          maxLength={60}
          autoComplete="off"
          required
          error={create.fieldError('name')}
        />
        <SelectField
          label="Year level"
          name="yearLevel"
          hint="Students who join start on this year level. You can change it for each student."
          options={[CHOOSE_YEAR, ...yearLevelOptions]}
          defaultValue=""
          required
          error={create.fieldError('yearLevel')}
        />
        <SubmitButton pending={create.isSubmitting} pendingLabel="Creating…">
          Create class
        </SubmitButton>
      </create.fetcher.Form>
    </Panel>
  );
}
