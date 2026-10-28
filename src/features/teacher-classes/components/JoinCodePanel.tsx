import { DoorClosed, KeyRound } from 'lucide-react';
import { useFetcherForm } from '@/app/forms/useFetcherForm';
import { FormMessage } from '@/components/forms/FormMessage';
import { ConfirmAction } from '@/components/ui/ConfirmAction';
import { CopyButton } from '@/components/ui/CopyButton';
import { Panel } from '@/components/ui/Panel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { formatJoinCode, type TeacherClass } from '@/domain/classes';
import { JoinCode } from './JoinCode';
import styles from './JoinCodePanel.module.css';

/** The class code students use to join, copying it, and replacing it if it has been shared. */
export function JoinCodePanel({ teacherClass }: { teacherClass: TeacherClass }) {
  const regenerate = useFetcherForm();

  return (
    <Panel title="Class code" icon={KeyRound}>
      <div className={styles.code}>
        <JoinCode code={teacherClass.joinCode} size="large" />
        {!teacherClass.joiningEnabled && (
          <StatusBadge tone="warning" icon={DoorClosed}>
            Joining off
          </StatusBadge>
        )}
      </div>
      <p className={styles.help}>
        {teacherClass.joiningEnabled
          ? 'Students enter this code on their Class page to join.'
          : 'New students can’t join until you turn joining on in Class settings.'}
      </p>
      {regenerate.successMessage && (
        <FormMessage tone="success">{regenerate.successMessage}</FormMessage>
      )}
      {regenerate.formMessage && <FormMessage tone="error">{regenerate.formMessage}</FormMessage>}
      <div className={styles.actions}>
        <CopyButton text={formatJoinCode(teacherClass.joinCode)} label="Copy code" />
        <regenerate.fetcher.Form method="post" onSubmit={regenerate.onSubmit}>
          <ConfirmAction
            triggerLabel="Make a new code"
            message="The current code will stop working. Students already in the class stay in it."
            confirmLabel="Make new code"
            intent="regenerate-code"
            pending={regenerate.isSubmitting}
            pendingLabel="Making…"
          />
        </regenerate.fetcher.Form>
      </div>
    </Panel>
  );
}
