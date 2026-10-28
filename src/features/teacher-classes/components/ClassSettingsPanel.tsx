import { useRef } from 'react';
import { Settings2 } from 'lucide-react';
import { useFetcherForm } from '@/app/forms/useFetcherForm';
import { CheckboxField } from '@/components/forms/CheckboxField';
import { FormMessage } from '@/components/forms/FormMessage';
import { SelectField } from '@/components/forms/SelectField';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { TextField } from '@/components/forms/TextField';
import { Panel } from '@/components/ui/Panel';
import type { TeacherClass } from '@/domain/classes';
import { yearLevelToNumber } from '@/domain/student';
import { yearLevelOptions } from '@/features/classes/yearLevelOptions';
import styles from './ClassForms.module.css';

/** The class's name, year level, and whether students can join or leave by themselves. */
export function ClassSettingsPanel({ teacherClass }: { teacherClass: TeacherClass }) {
  const formRef = useRef<HTMLFormElement>(null);
  const settings = useFetcherForm({ formRef });
  // Rebuild the form when the saved settings change, so it always starts from them.
  const savedSettings = [
    teacherClass.name,
    teacherClass.yearLevel,
    teacherClass.joiningEnabled,
    teacherClass.studentsCanLeave,
  ].join('|');

  return (
    <Panel title="Class settings" icon={Settings2}>
      {settings.successMessage && (
        <FormMessage tone="success">{settings.successMessage}</FormMessage>
      )}
      {settings.formMessage && <FormMessage tone="error">{settings.formMessage}</FormMessage>}
      <settings.fetcher.Form
        key={savedSettings}
        method="post"
        onSubmit={settings.onSubmit}
        ref={formRef}
        noValidate
        className={styles.form}
      >
        <TextField
          label="Class name"
          name="name"
          defaultValue={teacherClass.name}
          maxLength={60}
          autoComplete="off"
          required
          error={settings.fieldError('name')}
        />
        <SelectField
          label="Class year level"
          name="yearLevel"
          hint="Students on the class’s year level move with it. Students you’ve set to a different year level keep theirs."
          options={yearLevelOptions}
          defaultValue={String(yearLevelToNumber(teacherClass.yearLevel))}
          error={settings.fieldError('yearLevel')}
        />
        <fieldset className={styles.checkboxes}>
          <legend className={styles.legend}>Students can</legend>
          <CheckboxField
            label="Join with the class code"
            name="joiningEnabled"
            defaultChecked={teacherClass.joiningEnabled}
          />
          <CheckboxField
            label="Leave the class themselves"
            name="studentsCanLeave"
            defaultChecked={teacherClass.studentsCanLeave}
            hint="If this is off, only you can remove students."
          />
        </fieldset>
        <SubmitButton
          name="intent"
          value="settings"
          pending={settings.isSubmitting}
          pendingLabel="Saving…"
        >
          Save settings
        </SubmitButton>
      </settings.fetcher.Form>
    </Panel>
  );
}
