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
    shopCollection: '/student/more/shop/collection',
    shopHistory: '/student/more/shop/history',
  },
  teacher: {
    home: '/teacher',
    classes: '/teacher/classes',
    classDetail: (classId: string) => `/teacher/classes/${encodeURIComponent(classId)}`,
    classStudents: (classId: string) => `/teacher/classes/${encodeURIComponent(classId)}/students`,
    classTasks: (classId: string) => `/teacher/classes/${encodeURIComponent(classId)}/tasks`,
    classProgress: (classId: string) => `/teacher/classes/${encodeURIComponent(classId)}/progress`,
    tasks: '/teacher/tasks',
    /** Setting a new task, optionally for one class already chosen. */
    newTask: (classId?: string) =>
      classId ? `/teacher/tasks/new?class=${encodeURIComponent(classId)}` : '/teacher/tasks/new',
    taskDetail: (taskId: string) => `/teacher/tasks/${encodeURIComponent(taskId)}`,
    reports: '/teacher/reports',
    more: '/teacher/more',
  },
} as const;
