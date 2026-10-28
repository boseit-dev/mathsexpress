import { Award, CalendarCheck, Gift, Menu, ShoppingBag, Trophy, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type MouseEvent } from 'react';
import { useLocation } from 'react-router';
import type { CurrentStudent } from '@/domain/student';
import { paths } from '@/config/paths';
import { SidePanelContents } from './SidePanelContents';
import styles from './SidePanelToolbar.module.css';

export type PanelName = 'leaderboard' | 'shop' | 'challenges' | 'achievements' | 'rewards';

const TOOLS = [
  { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'challenges', label: 'Daily challenges', icon: CalendarCheck },
  { id: 'achievements', label: 'Achievements', icon: Award },
  { id: 'rewards', label: 'Rewards', icon: Gift },
] as const;

/** Unanimated, accessible panel controls. The motion layer is a later separate task. */
export function SidePanelToolbar({ student }: { student: CurrentStudent }) {
  const { pathname } = useLocation();
  const [active, setActive] = useState<PanelName | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const headingId = useId();
  const dialogId = useId();
  const menuId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active) {
      if (!dialog.open) dialog.showModal();
      dialog.querySelector<HTMLButtonElement>('[data-panel-close]')?.focus();
    } else if (dialog.open) {
      dialog.close();
      triggerRef.current?.focus();
    }
  }, [active]);

  // Lesson controls need the right edge; do not cover answer and next-question buttons.
  if (pathname.startsWith(`${paths.student.learn}/`)) return null;

  function openPanel(id: PanelName, event: MouseEvent<HTMLButtonElement>) {
    triggerRef.current = event.currentTarget;
    setMobileOpen(false);
    setActive(id);
  }

  function buttons() {
    return TOOLS.map(({ id, label, icon: Icon }) => (
      <button
        key={id}
        type="button"
        className={styles.tool}
        aria-label={label}
        aria-controls={dialogId}
        aria-expanded={active === id}
        onClick={(event) => {
          openPanel(id, event);
        }}
      >
        <Icon aria-hidden="true" />
        <span className={styles.tooltip} aria-hidden="true">
          {label}
        </span>
      </button>
    ));
  }

  const title = TOOLS.find((tool) => tool.id === active)?.label ?? 'Quick tools';

  return (
    <>
      <aside className={styles.desktopToolbar} aria-label="Student quick tools">
        {buttons()}
      </aside>
      <div className={styles.mobileToolbar}>
        <button
          className={styles.mobileToggle}
          type="button"
          aria-expanded={mobileOpen}
          aria-controls={menuId}
          onClick={() => {
            setMobileOpen((open) => !open);
          }}
        >
          <Menu aria-hidden="true" />
          Quick tools
        </button>
        <div className={styles.mobileMenu} id={menuId} hidden={!mobileOpen}>
          {buttons()}
        </div>
      </div>
      <dialog
        ref={dialogRef}
        id={dialogId}
        className={styles.dialog}
        aria-labelledby={headingId}
        onCancel={(event) => {
          event.preventDefault();
          setActive(null);
        }}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) setActive(null);
        }}
      >
        <div className={styles.dialogInner}>
          <header className={styles.dialogHeader}>
            <h2 id={headingId}>{title}</h2>
            <button
              type="button"
              data-panel-close
              className={styles.close}
              aria-label="Close panel"
              onClick={() => {
                setActive(null);
              }}
            >
              <X aria-hidden="true" />
            </button>
          </header>
          {active && <SidePanelContents panel={active} student={student} />}
        </div>
      </dialog>
    </>
  );
}
