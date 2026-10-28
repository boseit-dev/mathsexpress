import { createContext } from 'react';

export interface LatestForm {
  /** The id of the form submitted most recently on this page. */
  latest: string | null;
  setLatest: (formId: string) => void;
}

/** Lets a page with several forms show only the result of the one used last. */
export const LatestFormContext = createContext<LatestForm | null>(null);
