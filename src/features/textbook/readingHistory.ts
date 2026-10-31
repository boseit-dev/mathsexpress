/** A per-student, device-local reading shortcut. It is not a synced progress record. */
export interface LastReadChapter {
  bookId: string;
  chapterId: string;
}

function storageKey(studentId: string) {
  return `mathsexpress:recent-chapter:${studentId}`;
}

export function getLastReadChapter(studentId: string): LastReadChapter | null {
  try {
    const raw = window.localStorage.getItem(storageKey(studentId));
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (
      value === null ||
      typeof value !== 'object' ||
      !('bookId' in value) ||
      !('chapterId' in value) ||
      typeof value.bookId !== 'string' ||
      typeof value.chapterId !== 'string'
    ) return null;
    return { bookId: value.bookId, chapterId: value.chapterId };
  } catch {
    // Private browsing or unavailable storage must never block textbooks.
    return null;
  }
}

export function saveLastReadChapter(studentId: string, chapter: LastReadChapter) {
  try {
    window.localStorage.setItem(storageKey(studentId), JSON.stringify(chapter));
  } catch {
    // Reading still works without browser storage.
  }
}
