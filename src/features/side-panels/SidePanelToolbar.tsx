import { Award, CalendarCheck, Gift, Menu, ShoppingBag, Trophy, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import { useLocation } from 'react-router';
import type { CurrentStudent } from '@/domain/student';
import type { ShopRepository } from '@/data/repositories';
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

/** How long the closing slide takes; matches --duration-panel-exit. None for reduced motion. */
const CLOSE_MS = 240;

function closeDelay() {
  const animate =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  return animate ? CLOSE_MS : 0;
}

/**
 * The student quick tools: a toolbar on the right edge (a menu on phones) that opens one sliding
 * panel at a time. Inside a panel, the same five tools switch between panels without closing it.
 */
export function SidePanelToolbar({
  student,
  shop,
}: {
  student: CurrentStudent;
  shop: ShopRepository;
}) {
  const { pathname } = useLocation();
  const [active, setActive] = useState<PanelName | null>(null);
  // True while the panel slides out; the dialog closes when that has finished.
  const [closing, setClosing] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const headingId = useId();
  const dialogId = useId();
  const menuId = useId();

  // A link inside a panel leads to another page: close straight away, and the page takes focus.
  const [shownPathname, setShownPathname] = useState(pathname);
  if (pathname !== shownPathname) {
    setShownPathname(pathname);
    setActive(null);
    setClosing(false);
    setMobileOpen(false);
  }

  // Open the dialog for the first panel (switching panels keeps it open); close it without
  // animation when the panel is cleared some other way, such as by navigation.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!active) {
      if (dialog.open) dialog.close();
      return;
    }
    if (dialog.open) return;
    dialog.showModal();
    dialog.querySelector<HTMLButtonElement>('[data-panel-close]')?.focus();
  }, [active]);

  // Let the panel slide out, then close it and return focus to the button that opened it.
  useEffect(() => {
    if (!closing) return;
    const timer = setTimeout(() => {
      dialogRef.current?.close();
      setClosing(false);
      setActive(null);
      triggerRef.current?.focus();
    }, closeDelay());
    return () => {
      clearTimeout(timer);
    };
  }, [closing]);

  // Lesson controls need the right edge; do not cover answer and next-question buttons.
  if (
    pathname.startsWith(`${paths.student.learn}/`) ||
    pathname === paths.student.textbookChapter('year-9', 'solving-linear-equations')
  ) {
    return null;
  }

  function openPanel(id: PanelName, event: MouseEvent<HTMLButtonElement>) {
    triggerRef.current = event.currentTarget;
    setMobileOpen(false);
    setClosing(false);
    setActive(id);
  }

  function closePanel() {
    if (active) setClosing(true);
  }

  function buttons() {
    return TOOLS.map(({ id, label, icon: Icon }, index) => (
      <button
        key={id}
        type="button"
        className={styles.tool}
        style={{ '--i': index } as CSSProperties}
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
          {mobileOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
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
        data-closing={closing || undefined}
        aria-labelledby={headingId}
        onCancel={(event) => {
          event.preventDefault();
          closePanel();
        }}
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) closePanel();
        }}
      >
        <div className={styles.dialogInner}>
          <header className={styles.dialogHeader}>
            <div className={styles.headingRow}>
              <h2 key={title} id={headingId} className={styles.heading}>
                {title}
              </h2>
              <button
                type="button"
                data-panel-close
                className={styles.close}
                aria-label="Close panel"
                onClick={closePanel}
              >
                <X aria-hidden="true" />
              </button>
            </div>
            <div className={styles.switcher} role="group" aria-label="Switch panel">
              {TOOLS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={styles.switch}
                  aria-label={label}
                  aria-pressed={active === id}
                  onClick={() => {
                    setActive(id);
                  }}
                >
                  <Icon aria-hidden="true" />
                </button>
              ))}
            </div>
          </header>
          {/* Keyed by panel, so switching replays the staggered entrance. */}
          {active && (
            <SidePanelContents key={active} panel={active} student={student} shop={shop} />
          )}
        </div>
      </dialog>
    </>
  );
}
