import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import type { ShopRepository } from '@/data/repositories';
import type { ShopState } from '@/domain/shop';
import { studentNavigation } from '@/config/navigation';
import { paths } from '@/config/paths';
import { getFullName } from '@/domain/people';
import { SidePanelToolbar } from '@/features/side-panels/SidePanelToolbar';
import { AccountMenu } from '../AccountMenu';
import { AppShell } from '../AppShell';
import { StudentLookContext } from './studentLook';
import { useStudentLayoutData } from './studentLayoutLoader';

/** Frame for every student page: top navigation Home | Learn | Textbook | Class | More. */
export function StudentLayout({ shop }: { shop: ShopRepository }) {
  const student = useStudentLayoutData();
  const [appearance, setAppearance] = useState<ShopState | null>(null);

  useEffect(() => {
    let alive = true;
    shop
      .getState()
      .then((state) => {
        if (alive) setAppearance(state);
      })
      .catch(() => {
        // The shop should never prevent students from learning or reaching their classes.
      });
    function onUpdate(event: Event) {
      if (event instanceof CustomEvent) setAppearance(event.detail as ShopState);
    }
    window.addEventListener('mathsexpress:shop-updated', onUpdate);
    return () => {
      alive = false;
      window.removeEventListener('mathsexpress:shop-updated', onUpdate);
    };
  }, [shop]);

  const theme = appearance?.equipped.theme;
  useEffect(() => {
    if (theme) {
      document.documentElement.dataset.shopTheme = theme;
    } else {
      document.documentElement.removeAttribute('data-shop-theme');
    }
    return () => {
      document.documentElement.removeAttribute('data-shop-theme');
    };
  }, [theme]);
  const { pathname } = useLocation();

  return (
    <AppShell
      homePath={paths.student.home}
      navigation={studentNavigation}
      navigationLabel="Student"
      account={
        <AccountMenu
          name={getFullName(student)}
          roleLabel="Student"
          look={appearance?.equipped ?? null}
        />
      }
    >
      <StudentLookContext value={appearance?.equipped ?? null}>
        <Outlet context={student} />
        <SidePanelToolbar key={pathname} student={student} shop={shop} />
      </StudentLookContext>
    </AppShell>
  );
}
