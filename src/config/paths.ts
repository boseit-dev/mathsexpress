/** Every address in the app, so links and routes never drift apart. */
export const paths = {
  root: '/',
  signIn: '/sign-in',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',
  welcome: '/welcome',
  signOut: '/sign-out',
  /** Where links in confirmation and password-reset emails land. */
  authConfirm: '/auth/confirm',
  /** Where Google sends people back after signing in. */
  authCallback: '/auth/callback',
  /** The mascot workshop: every view, pose and animation, for review. Not linked anywhere. */
  mascot: '/mascot',
  student: {
    home: '/student',
    learn: '/student/learn',
    lesson: (lessonId: string) => `/student/learn/${encodeURIComponent(lessonId)}`,
    textbook: '/student/textbook',
    textbookBook: (bookId: string) => `/student/textbook/${encodeURIComponent(bookId)}`,
    textbookChapter: (bookId: string, chapterId: string) =>
      `/student/textbook/${encodeURIComponent(bookId)}/${encodeURIComponent(chapterId)}`,
    class: '/student/class',
    tasks: '/student/class/tasks',
    more: '/student/more',
    shop: '/student/more/shop',
  },
  teacher: {
    home: '/teacher',
    classes: '/teacher/classes',
    classDetail: (classId: string) => `/teacher/classes/${encodeURIComponent(classId)}`,
    tasks: '/teacher/tasks',
    reports: '/teacher/reports',
    more: '/teacher/more',
  },
} as const;
