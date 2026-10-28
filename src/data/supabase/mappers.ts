// Converts database rows into domain objects. Composite results from Postgres are nullable by
// type, so every field is checked: a missing value is a server bug, reported loudly.
import type { Profile } from '@/domain/account';
import type { ClassStudent, StudentClassMembership, TeacherClass } from '@/domain/classes';
import { AppError } from '@/domain/errors';
import { yearLevelFromNumber } from '@/domain/student';
import type { Database } from './database.types';

type Composite = Database['public']['CompositeTypes'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

function required<T>(value: T | null | undefined, field: string): T {
  if (value === null || value === undefined) {
    throw new AppError('unknown', { cause: new Error(`The server response is missing ${field}`) });
  }
  return value;
}

export function toProfile(row: ProfileRow): Profile {
  return { id: row.id, role: row.role, firstName: row.first_name, lastName: row.last_name };
}

export function toTeacherClass(row: Composite['teacher_class']): TeacherClass {
  return {
    id: required(row.id, 'id'),
    name: required(row.name, 'name'),
    yearLevel: yearLevelFromNumber(required(row.year_level, 'year_level')),
    joinCode: required(row.join_code, 'join_code'),
    joiningEnabled: required(row.joining_enabled, 'joining_enabled'),
    studentsCanLeave: required(row.students_can_leave, 'students_can_leave'),
    studentCount: required(row.student_count, 'student_count'),
    createdAt: required(row.created_at, 'created_at'),
  };
}

export function toStudentClass(row: Composite['student_class']): StudentClassMembership {
  return {
    classId: required(row.class_id, 'class_id'),
    className: required(row.class_name, 'class_name'),
    classYearLevel: yearLevelFromNumber(required(row.class_year_level, 'class_year_level')),
    yearLevel: yearLevelFromNumber(required(row.my_year_level, 'my_year_level')),
    // Optional, so one class without a teacher can never stop a student's pages loading.
    teacherName: row.teacher_name,
    studentsCanLeave: required(row.students_can_leave, 'students_can_leave'),
    joinedAt: required(row.joined_at, 'joined_at'),
  };
}

export function toClassStudent(row: Composite['class_student']): ClassStudent {
  return {
    studentId: required(row.student_id, 'student_id'),
    firstName: required(row.first_name, 'first_name'),
    lastName: required(row.last_name, 'last_name'),
    yearLevel: yearLevelFromNumber(required(row.year_level, 'year_level')),
    joinedAt: required(row.joined_at, 'joined_at'),
  };
}
