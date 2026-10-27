/** Every address in the app, so links and routes never drift apart. */
export const paths = {
  root: '/',
  student: {
    home: '/student',
    learn: '/student/learn',
    textbook: '/student/textbook',
    class: '/student/class',
    more: '/student/more',
  },
  teacher: {
    home: '/teacher',
    classes: '/teacher/classes',
    tasks: '/teacher/tasks',
    reports: '/teacher/reports',
    more: '/teacher/more',
  },
} as const;
