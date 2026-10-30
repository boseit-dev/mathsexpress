import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Form, Link } from 'react-router';
import { StudentAvatar } from '@/components/cosmetics/StudentAvatar';
import { Button } from '@/components/ui/Button';
import { paths } from '@/config/paths';
import type { Look } from '@/domain/shop';
import styles from './AccountMenu.module.css';

interface AccountMenuProps {
  name: string;
  roleLabel: string;
  /** A student's equipped look, shown as their avatar. Teachers have none and show initials. */
  look?: Look | null;
}

/**
 * The signed-in person's name and a Sign out button, behind a disclosure button. Closes with
 * Escape (returning focus to the button) or a click outside.
 */
export function AccountMenu({ name, roleLabel, look }: AccountMenuProps) {
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
        <StudentAvatar name={name} look={look} decorative />
        <span className={styles.name}>{name}</span>
        <ChevronDown className={styles.chevron} />
      </button>
      {open && (
        <div id={panelId} className={styles.panel}>
          <div className={styles.who}>
            {look && <StudentAvatar name={name} look={look} size="large" decorative />}
            <div>
              <p className={styles.panelName}>{name}</p>
              <p className={styles.role}>{roleLabel} account</p>
              {look && (
                <Link
                  to={paths.student.shopCollection}
                  className={styles.lookLink}
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  Change my look
                </Link>
              )}
            </div>
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
