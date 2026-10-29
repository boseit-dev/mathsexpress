import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Form } from 'react-router';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { paths } from '@/config/paths';
import styles from './AccountMenu.module.css';

interface AccountMenuProps {
  name: string;
  roleLabel: string;
  frame?: string | null;
}

/**
 * The signed-in person's name and a Sign out button, behind a disclosure button. Closes with
 * Escape (returning focus to the button) or a click outside.
 */
export function AccountMenu({ name, roleLabel, frame }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;
      setOpen(false);
      buttonRef.current?.focus();
    }
    function closeOnOutsideClick(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsideClick);
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsideClick);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={styles.menu}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Account: ${name}`}
        onClick={() => {
          setOpen((current) => !current);
        }}
      >
        <span className={styles.avatarOutline} data-frame={frame ?? undefined}>
          <Avatar name={name} decorative />
        </span>
        <span className={styles.name}>{name}</span>
        <ChevronDown className={styles.chevron} />
      </button>
      {open && (
        <div id={panelId} className={styles.panel}>
          <div>
            <p className={styles.panelName}>{name}</p>
            <p className={styles.role}>{roleLabel} account</p>
          </div>
          <Form method="post" action={paths.signOut}>
            <Button type="submit" variant="secondary" className={styles.signOut}>
              Sign out
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
}
