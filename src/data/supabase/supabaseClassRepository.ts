import { normalizeJoinCode } from '@/domain/classes';
import { yearLevelToNumber } from '@/domain/student';
import { cleanText } from '@/domain/validation';
import type { ClassRepository } from '../repositories';
import type { MathsExpressClient } from './client';
import { throwIfError, unwrap } from './errors';
import { toClassStudent, toStudentClass, toTeacherClass } from './mappers';

/** Class data through the database functions, which check every permission on the server. */
export function createSupabaseClassRepository(client: MathsExpressClient): ClassRepository {
  return {
    async listMyClasses({ signal } = {}) {
      const request = client.rpc('my_classes');
      const rows = unwrap(await (signal ? request.abortSignal(signal) : request));
      return rows.map(toStudentClass);
    },

    async joinClass(code) {
      return toStudentClass(
        unwrap(await client.rpc('join_class', { code: normalizeJoinCode(code) })),
      );
    },

    async leaveClass(classId) {
      const { error } = await client.rpc('leave_class', { class_id: classId });
      throwIfError(error);
    },

    async listTeacherClasses({ signal } = {}) {
      const request = client.rpc('teacher_classes');
      const rows = unwrap(await (signal ? request.abortSignal(signal) : request));
      return rows.map(toTeacherClass);
    },

    async createClass(name, yearLevel) {
      return toTeacherClass(
        unwrap(
          await client.rpc('create_class', {
            name: cleanText(name),
            year_level: yearLevelToNumber(yearLevel),
          }),
        ),
      );
    },

    async getTeacherClass(classId, { signal } = {}) {
      const request = client.rpc('get_teacher_class', { class_id: classId });
      return toTeacherClass(unwrap(await (signal ? request.abortSignal(signal) : request)));
    },

    async updateClass(classId, settings) {
      return toTeacherClass(
        unwrap(
          await client.rpc('update_class', {
            class_id: classId,
            name: cleanText(settings.name),
            year_level: yearLevelToNumber(settings.yearLevel),
            joining_enabled: settings.joiningEnabled,
            students_can_leave: settings.studentsCanLeave,
          }),
        ),
      );
    },

    async regenerateJoinCode(classId) {
      return unwrap(await client.rpc('regenerate_join_code', { class_id: classId }));
    },

    async listClassStudents(classId, { signal } = {}) {
      const request = client.rpc('class_students', { class_id: classId });
      const rows = unwrap(await (signal ? request.abortSignal(signal) : request));
      return rows.map(toClassStudent);
    },

    async setStudentYearLevel(classId, studentId, yearLevel) {
      return toClassStudent(
        unwrap(
          await client.rpc('set_student_year_level', {
            class_id: classId,
            student_id: studentId,
            year_level: yearLevelToNumber(yearLevel),
          }),
        ),
      );
    },

    async removeStudent(classId, studentId) {
      const { error } = await client.rpc('remove_student', {
        class_id: classId,
        student_id: studentId,
      });
      throwIfError(error);
    },
  };
}
