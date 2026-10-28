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
  student: {
    home: '/student',
    learn: '/student/learn',
    textbook: '/student/textbook',
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
