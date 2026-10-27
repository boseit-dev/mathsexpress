import { describe, expect, it } from 'vitest';
import type { Database } from '../../src/data/supabase/database.types.ts';
import {
  admin,
  anonClient,
  createClass,
  createSignedInUser,
  createStudent,
  createTeacher,
  type TestUser,
} from './helpers.ts';

type StudentClass = Database['public']['CompositeTypes']['student_class'];
type ClassStudent = Database['public']['CompositeTypes']['class_student'];

async function myClasses(student: TestUser): Promise<StudentClass[]> {
  const { data, error } = await student.client.rpc('my_classes');
  if (error) throw error;
  return data;
}

async function roster(teacher: TestUser, classId: string): Promise<ClassStudent[]> {
  const { data, error } = await teacher.client.rpc('class_students', { class_id: classId });
  if (error) throw error;
  return data;
}

describe('creating classes', () => {
  it('lets a teacher create a class with a secure 8-character join code', async () => {
    const teacher = await createTeacher();
    const created = await createClass(teacher, '  9M2   Mathematics ', 9);
    expect(created).toMatchObject({
      name: '9M2 Mathematics',
      year_level: 9,
      joining_enabled: true,
      students_can_leave: true,
      student_count: 0,
    });
    expect(created.join_code).toMatch(/^[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$/);

    const { data } = await teacher.client.rpc('teacher_classes');
    expect(data?.map((row) => row.id)).toContain(created.id);
  });

  it('gives every class a different join code', async () => {
    const teacher = await createTeacher();
    const codes = new Set<string>();
    for (let index = 0; index < 5; index += 1) {
      codes.add((await createClass(teacher, `Class ${index}`, 7)).join_code);
    }
    expect(codes.size).toBe(5);
  });

  it('rejects invalid names and year levels', async () => {
    const teacher = await createTeacher();
    const noName = await teacher.client.rpc('create_class', { name: ' ', year_level: 9 });
    const badYear = await teacher.client.rpc('create_class', { name: 'Maths', year_level: 13 });
    expect(noName.error?.message).toBe('invalid_class_name');
    expect(badYear.error?.message).toBe('invalid_year_level');
  });

  it('does not let students create classes', async () => {
    const student = await createStudent();
    const { error } = await student.client.rpc('create_class', { name: 'Maths', year_level: 9 });
    expect(error?.message).toBe('teachers_only');
  });
});

describe('joining classes', () => {
  it('joins with a valid code, ignoring case, spaces and hyphens, at the class year level', async () => {
    const teacher = await createTeacher('Priya', 'Patel');
    const created = await createClass(teacher, '8A Maths', 8);
    const student = await createStudent();
    const typed = `${created.join_code.slice(0, 4).toLowerCase()} - ${created.join_code.slice(4)}`;

    const { data, error } = await student.client.rpc('join_class', { code: typed });
    expect(error).toBeNull();
    expect(data).toMatchObject({
      class_id: created.id,
      class_name: '8A Maths',
      class_year_level: 8,
      my_year_level: 8,
      teacher_name: 'Priya Patel',
    });
    expect(await myClasses(student)).toHaveLength(1);
  });

  it('explains invalid, unknown and duplicate codes', async () => {
    const teacher = await createTeacher();
    const created = await createClass(teacher);
    const student = await createStudent();

    const malformed = await student.client.rpc('join_class', { code: 'ABC' });
    const unknown = await student.client.rpc('join_class', { code: 'ZZZZZZZZ' });
    await student.client.rpc('join_class', { code: created.join_code });
    const duplicate = await student.client.rpc('join_class', { code: created.join_code });

    expect(malformed.error?.message).toBe('invalid_join_code');
    expect(unknown.error?.message).toBe('join_code_not_found');
    expect(duplicate.error?.message).toBe('already_member');
    expect(await myClasses(student)).toHaveLength(1);
  });

  it('refuses new students when the teacher has closed joining', async () => {
    const teacher = await createTeacher();
    const created = await createClass(teacher, 'Closed class', 10);
    await teacher.client.rpc('update_class', {
      class_id: created.id,
      name: created.name,
      year_level: 10,
      joining_enabled: false,
      students_can_leave: true,
    });
    const student = await createStudent();
    const { error } = await student.client.rpc('join_class', { code: created.join_code });
    expect(error?.message).toBe('joining_closed');
  });

  it('does not let teachers join classes as students', async () => {
    const owner = await createTeacher();
    const created = await createClass(owner);
    const otherTeacher = await createTeacher();
    const { error } = await otherTeacher.client.rpc('join_class', { code: created.join_code });
    expect(error?.message).toBe('students_only');
  });

  it('stops the old code working once the teacher makes a new one', async () => {
    const teacher = await createTeacher();
    const created = await createClass(teacher);
    const { data: newCode } = await teacher.client.rpc('regenerate_join_code', {
      class_id: created.id,
    });
    expect(newCode).not.toBe(created.join_code);

    const student = await createStudent();
    const withOld = await student.client.rpc('join_class', { code: created.join_code });
    const withNew = await student.client.rpc('join_class', { code: newCode ?? '' });
    expect(withOld.error?.message).toBe('join_code_not_found');
    expect(withNew.error).toBeNull();
  });
});

describe('what students can see and do', () => {
  it('never shows students the join code, other students or the raw tables', async () => {
    const teacher = await createTeacher();
    const created = await createClass(teacher);
    const student = await createStudent();
    const classmate = await createStudent('Other', 'Student');
    await student.client.rpc('join_class', { code: created.join_code });
    await classmate.client.rpc('join_class', { code: created.join_code });

    const [membership] = await myClasses(student);
    expect(membership).not.toHaveProperty('join_code');
    expect(JSON.stringify(membership)).not.toContain(created.join_code);

    const codes = await student.client.from('class_join_codes').select('*');
    const members = await student.client.from('class_members').select('*');
    const classes = await student.client.from('classes').select('*');
    expect(codes.error?.code).toBe('42501');
    expect(members.error?.code).toBe('42501');
    expect(classes.error?.code).toBe('42501');

    const asTeacherView = await student.client.rpc('class_students', { class_id: created.id });
    expect(asTeacherView.error?.message).toBe('teachers_only');
  });

  it('does not let students change their own year level', async () => {
    const teacher = await createTeacher();
    const created = await createClass(teacher, 'Year 9', 9);
    const student = await createStudent();
    await student.client.rpc('join_class', { code: created.join_code });

    const viaFunction = await student.client.rpc('set_student_year_level', {
      class_id: created.id,
      student_id: student.id,
      year_level: 12,
    });
    const viaTable = await student.client
      .from('class_members')
      .update({ year_level: 12 })
      .eq('student_id', student.id);
    expect(viaFunction.error?.message).toBe('teachers_only');
    expect(viaTable.error?.code).toBe('42501');
    expect((await myClasses(student))[0]?.my_year_level).toBe(9);
  });

  it('lets students leave a class only when the teacher allows it', async () => {
    const teacher = await createTeacher();
    const created = await createClass(teacher);
    const student = await createStudent();
    await student.client.rpc('join_class', { code: created.join_code });

    await teacher.client.rpc('update_class', {
      class_id: created.id,
      name: created.name,
      year_level: created.year_level,
      joining_enabled: true,
      students_can_leave: false,
    });
    const blocked = await student.client.rpc('leave_class', { class_id: created.id });
    expect(blocked.error?.message).toBe('leaving_not_allowed');

    await teacher.client.rpc('update_class', {
      class_id: created.id,
      name: created.name,
      year_level: created.year_level,
      joining_enabled: true,
      students_can_leave: true,
    });
    const allowed = await student.client.rpc('leave_class', { class_id: created.id });
    expect(allowed.error).toBeNull();
    expect(await myClasses(student)).toEqual([]);
  });
});

describe('teacher class management', () => {
  async function classWithStudent() {
    const teacher = await createTeacher();
    const created = await createClass(teacher, 'Managed class', 9);
    const student = await createStudent('Jo', 'Brown');
    await student.client.rpc('join_class', { code: created.join_code });
    return { teacher, created, student };
  }

  it('shows the teacher the names and year levels of their students only', async () => {
    const { teacher, created, student } = await classWithStudent();
    const students = await roster(teacher, created.id);
    expect(students).toEqual([
      expect.objectContaining({
        student_id: student.id,
        first_name: 'Jo',
        last_name: 'Brown',
        year_level: 9,
      }),
    ]);
    expect(JSON.stringify(students)).not.toContain(student.email);
  });

  it('changes a student’s year level and records who changed it', async () => {
    const { teacher, created, student } = await classWithStudent();
    const { data, error } = await teacher.client.rpc('set_student_year_level', {
      class_id: created.id,
      student_id: student.id,
      year_level: 10,
    });
    expect(error).toBeNull();
    expect(data).toMatchObject({ student_id: student.id, year_level: 10 });
    expect((await myClasses(student))[0]?.my_year_level).toBe(10);

    const { data: audit } = await admin
      .from('year_level_changes')
      .select('previous_year_level, new_year_level, changed_by')
      .eq('class_id', created.id)
      .eq('student_id', student.id);
    expect(audit).toEqual([{ previous_year_level: 9, new_year_level: 10, changed_by: teacher.id }]);
  });

  it('moves students on the class level when the class year level changes, keeping individual levels', async () => {
    const { teacher, created, student } = await classWithStudent();
    const advanced = await createStudent('Ana', 'Advanced');
    await advanced.client.rpc('join_class', { code: created.join_code });
    await teacher.client.rpc('set_student_year_level', {
      class_id: created.id,
      student_id: advanced.id,
      year_level: 11,
    });

    const { data, error } = await teacher.client.rpc('update_class', {
      class_id: created.id,
      name: 'Managed class',
      year_level: 10,
      joining_enabled: true,
      students_can_leave: true,
    });
    expect(error).toBeNull();
    expect(data).toMatchObject({ year_level: 10, student_count: 2 });
    expect((await myClasses(student))[0]?.my_year_level).toBe(10);
    expect((await myClasses(advanced))[0]?.my_year_level).toBe(11);
  });

  it('removes a student from the class', async () => {
    const { teacher, created, student } = await classWithStudent();
    const { error } = await teacher.client.rpc('remove_student', {
      class_id: created.id,
      student_id: student.id,
    });
    expect(error).toBeNull();
    expect(await roster(teacher, created.id)).toEqual([]);
    expect(await myClasses(student)).toEqual([]);

    const again = await teacher.client.rpc('remove_student', {
      class_id: created.id,
      student_id: student.id,
    });
    expect(again.error?.message).toBe('student_not_found');
  });

  it('gives other teachers no access to the class at all', async () => {
    const { created, student } = await classWithStudent();
    const outsider = await createTeacher('Out', 'Sider');

    const calls = await Promise.all([
      outsider.client.rpc('get_teacher_class', { class_id: created.id }),
      outsider.client.rpc('class_students', { class_id: created.id }),
      outsider.client.rpc('regenerate_join_code', { class_id: created.id }),
      outsider.client.rpc('set_student_year_level', {
        class_id: created.id,
        student_id: student.id,
        year_level: 3,
      }),
      outsider.client.rpc('remove_student', { class_id: created.id, student_id: student.id }),
      outsider.client.rpc('update_class', {
        class_id: created.id,
        name: 'Taken over',
        year_level: 1,
        joining_enabled: true,
        students_can_leave: true,
      }),
    ]);
    for (const { error } of calls) expect(error?.message).toBe('class_not_found');

    const { data: outsiderClasses } = await outsider.client.rpc('teacher_classes');
    expect(outsiderClasses).toEqual([]);
    expect((await myClasses(student))[0]).toMatchObject({
      class_name: 'Managed class',
      my_year_level: 9,
    });
  });

  it('gives students and signed-out visitors no teacher actions', async () => {
    const { created, student } = await classWithStudent();
    const visitor = anonClient();
    const noProfile = await createSignedInUser('no-profile-teacher');

    const asStudent = await student.client.rpc('remove_student', {
      class_id: created.id,
      student_id: student.id,
    });
    const asVisitor = await visitor.rpc('teacher_classes');
    const withoutProfile = await noProfile.client.rpc('teacher_classes');
    expect(asStudent.error?.message).toBe('teachers_only');
    expect(asVisitor.error?.code).toBe('42501');
    expect(withoutProfile.error?.message).toBe('profile_required');
  });
});

describe('persistence', () => {
  it('keeps classes and memberships across new sign-ins', async () => {
    const teacher = await createTeacher();
    const created = await createClass(teacher, 'Persistent class', 7);
    const student = await createStudent();
    await student.client.rpc('join_class', { code: created.join_code });

    const studentAgain = anonClient();
    await studentAgain.auth.signInWithPassword({
      email: student.email,
      password: student.password,
    });
    const { data } = await studentAgain.rpc('my_classes');
    expect(data).toEqual([
      expect.objectContaining({ class_name: 'Persistent class', my_year_level: 7 }),
    ]);

    const teacherAgain = anonClient();
    await teacherAgain.auth.signInWithPassword({
      email: teacher.email,
      password: teacher.password,
    });
    const { data: classes } = await teacherAgain.rpc('teacher_classes');
    expect(classes).toEqual([
      expect.objectContaining({ id: created.id, student_count: 1, join_code: created.join_code }),
    ]);
  });
});
