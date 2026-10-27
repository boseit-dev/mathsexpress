/** Every address in the app, so links and routes never drift apart. */
export const paths = {
  root: '/',
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
    tasks: '/teacher/tasks',
    reports: '/teacher/reports',
    more: '/teacher/more',
  },
} as const;
