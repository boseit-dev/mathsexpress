// DEVELOPMENT SAMPLE DATA. A fictional student used to build and test the interface before
// real accounts exist. Never present it as a real student.
import type { CurrentStudent } from '@/domain/student';

export const sampleStudent: CurrentStudent = {
  id: 'sample-student-mia',
  firstName: 'Mia',
  lastName: 'Chen',
  displayName: 'Mia C.',
  enrolment: {
    classId: 'sample-class-9m2',
    className: '9M2 Mathematics',
    yearLevel: 9,
    teacherName: 'Ms Patel',
  },
  coinBalance: 340,
};
