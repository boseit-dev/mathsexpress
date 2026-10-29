import { useEffect, useId, useRef, useState } from 'react';
import { Button } from './Button';
import { VisuallyHidden } from './VisuallyHidden';
import styles from './ConfirmAction.module.css';

interface ConfirmActionProps {
  /** The first button, e.g. "Leave class". */
  triggerLabel: string;
  /** Read after the label by screen readers to say what it acts on, e.g. the class name. */
  triggerContext?: string;
  /** What will happen, shown before the person confirms. */
  message: string;
  confirmLabel: string;
  /** The confirm button's `intent` value, read by the form's action. */
  intent: string;
  pending: boolean;
  pendingLabel: string;
  /**
   * Turns the confirm button off, e.g. while the same action is running for another row. The
   * first button stays on, so cancelling can always return focus to it.
   */
  disabled?: boolean;
}

/**
 * A destructive action that asks once before submitting. Place it inside the form that performs
 * the action; the confirm button is that form's submit button.
 */
export function ConfirmAction({
  triggerLabel,
  triggerContext,
  message,
  confirmLabel,
  intent,
  pending,
  pendingLabel,
  disabled = false,
}: ConfirmActionProps) {
  // Which button gets focus when the confirmation opens: Cancel while the confirm button has to
  // wait for another row. Null while closed.
  const [openedOn, setOpenedOn] = useState<'confirm' | 'cancel' | null>(null);
  const confirming = openedOn !== null;
  const [wasPending, setWasPending] = useState(pending);
  // When the action has finished, close the confirmation; the form shows what happened.
  if (pending !== wasPending) {
    setWasPending(pending);
    if (!pending) setOpenedOn(null);
  }
  const confirmRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasConfirming = useRef(false);
  const messageId = useId();

  // Move focus into the confirmation, and back to the first button if it is cancelled.
  useEffect(() => {
    if (openedOn) (openedOn === 'cancel' ? cancelRef : confirmRef).current?.focus();
    else if (wasConfirming.current) triggerRef.current?.focus();
    wasConfirming.current = openedOn !== null;
  }, [openedOn]);

  if (!confirming) {
    return (
      <Button
        ref={triggerRef}
        variant="secondary"
        onClick={() => {
          setOpenedOn(disabled ? 'cancel' : 'confirm');
        }}
      >
        {triggerLabel}
        {triggerContext && (
          <>
            {' '}
            <VisuallyHidden>{triggerContext}</VisuallyHidden>
          </>
        )}
      </Button>
    );
  }

  return (
    <div className={styles.confirm}>
      <p id={messageId} className={styles.message}>
        {message}
      </p>
      <div className={styles.buttons}>
        <Button
          ref={confirmRef}
          type="submit"
          name="intent"
          value={intent}
          className={styles.danger}
          disabled={pending || disabled}
          aria-busy={pending || undefined}
          aria-describedby={messageId}
        >
          {pending ? pendingLabel : confirmLabel}
        </Button>
        <Button
          ref={cancelRef}
          variant="secondary"
          disabled={pending}
          aria-describedby={messageId}
          onClick={() => {
            setOpenedOn(null);
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
