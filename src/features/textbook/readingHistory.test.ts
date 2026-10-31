import { beforeEach, describe, expect, it } from 'vitest';
import { getLastReadChapter, saveLastReadChapter } from './readingHistory';

describe('device-local textbook reading history', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('remembers the latest chapter for the right student only', () => {
    expect(getLastReadChapter('reader-a')).toBeNull();
    saveLastReadChapter('reader-a', { bookId: 'year-9', chapterId: 'solving-linear-equations' });
    expect(getLastReadChapter('reader-a')).toEqual({
      bookId: 'year-9',
      chapterId: 'solving-linear-equations',
    });
    expect(getLastReadChapter('reader-b')).toBeNull();
  });

  it('treats damaged browser data as no reading history', () => {
    window.localStorage.setItem('mathsexpress:recent-chapter:reader-a', '{not json');
    expect(getLastReadChapter('reader-a')).toBeNull();
  });
});
