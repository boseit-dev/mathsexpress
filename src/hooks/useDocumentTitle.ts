import { useEffect } from 'react';
import { appConfig } from '@/config/app';

/** Sets the browser tab title, e.g. "Learn · MathsExpress". */
export function useDocumentTitle(pageTitle: string) {
  useEffect(() => {
    document.title = `${pageTitle} · ${appConfig.name}`;
  }, [pageTitle]);
}
