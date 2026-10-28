// In-memory stand-ins for the auth, account and class services, for fast interface tests. They
// follow the same rules and error codes as the real database functions at the level the screens
// need; the real rules are tested against Supabase in tests/db.
import type { AccountRole, AuthUser, Profile } from '@/domain/account';
import {
  isValidJoinCode,
  normalizeJoinCode,
  type ClassStudent,
  type StudentClassMembership,
  type TeacherClass,
} from '@/domain/classes';
import { AppError } from '@/domain/errors';
import { getFullName, getShortName } from '@/domain/people';
import { createSampleStudentHomeRepository } from '@/data/sample/sampleStudentHomeRepository';
import type { AppDependencies, EmailLinkType } from '@/data/repositories';

/** A fixed "now" for tests: Wednesday 28 October 2026, 3:30 pm in Sydney. */
export const TEST_NOW = new Date(2026, 9, 28, 15, 30);

export const TEST_PASSWORD = 'maths-test-1';

interface FakeAccount {
  user: AuthUser;
  password: string;
  confirmed: boolean;
  profile: Profile | null;
}

interface FakeClass extends TeacherClass {
  teacherId: string;
  students: ClassStudent[];
}

export interface FakeState {
  accounts: Map<string, FakeAccount>;
  classes: FakeClass[];
  signedInEmail: string | null;
  googleAvailable: boolean;
  /** Email-link tokens that are still valid, by token. */
  emailLinks: Map<string, { email: string; type: EmailLinkType }>;
  sentEmails: { to: string; type: EmailLinkType }[];
}

export const testStudent = { email: 'mia@example.test', firstName: 'Mia', lastName: 'Chen' };
export const testTeacher = { email: 'priya@example.test', firstName: 'Priya', lastName: 'Patel' };
export const TEST_CLASS_CODE = 'ABCD2345';

function account(
  email: string,
  role: AccountRole | null,
  names: { firstName: string; lastName: string },
): FakeAccount {
  const id = `user-${email}`;
  return {
    user: { id, email, registration: {} },
    password: TEST_PASSWORD,
    confirmed: true,
    profile: role ? { id, role, ...names } : null,
  };
}

/** A world with one teacher, one student and one class the student has joined. */
export function createFakeState(): FakeState {
  const student = account(testStudent.email, 'student', testStudent);
  const teacher = account(testTeacher.email, 'teacher', testTeacher);
  return {
    accounts: new Map([
      [student.user.email, student],
      [teacher.user.email, teacher],
    ]),
    classes: [
      {
        id: 'class-9m2',
        name: '9M2 Mathematics',
        yearLevel: 9,
        joinCode: TEST_CLASS_CODE,
        joiningEnabled: true,
        studentsCanLeave: true,
        studentCount: 1,
        createdAt: '2026-10-01T00:00:00.000Z',
        teacherId: teacher.user.id,
        students: [
          {
            studentId: student.user.id,
            firstName: testStudent.firstName,
            lastName: testStudent.lastName,
            yearLevel: 9,
            joinedAt: '2026-10-02T00:00:00.000Z',
          },
        ],
      },
    ],
    signedInEmail: null,
    googleAvailable: false,
    emailLinks: new Map(),
    sentEmails: [],
  };
}

export function createFakeDependencies(state: FakeState): AppDependencies {
  function current(): FakeAccount | null {
    return state.signedInEmail ? (state.accounts.get(state.signedInEmail) ?? null) : null;
  }

  function requireProfile(): Profile {
    const profile = current()?.profile;
    if (!profile) throw new AppError(current() ? 'profile_required' : 'not_signed_in');
    return profile;
  }

  function requireRole(role: AccountRole): Profile {
    const profile = requireProfile();
    if (profile.role !== role)
      throw new AppError(role === 'teacher' ? 'teachers_only' : 'students_only');
    return profile;
  }

  function ownClass(classId: string): FakeClass {
    const teacher = requireRole('teacher');
    const found = state.classes.find(
      (item) => item.id === classId && item.teacherId === teacher.id,
    );
    if (!found) throw new AppError('class_not_found');
    return found;
  }

  function teacherView(item: FakeClass): TeacherClass {
    return {
      id: item.id,
      name: item.name,
      yearLevel: item.yearLevel,
      joinCode: item.joinCode,
      joiningEnabled: item.joiningEnabled,
      studentsCanLeave: item.studentsCanLeave,
      studentCount: item.students.length,
      createdAt: item.createdAt,
    };
  }

  function teacherName(item: FakeClass): string {
    const teacher = [...state.accounts.values()].find((entry) => entry.user.id === item.teacherId);
    return teacher?.profile ? getFullName(teacher.profile) : 'Unknown teacher';
  }

  function membership(item: FakeClass, studentId: string): StudentClassMembership {
    const student = item.students.find((entry) => entry.studentId === studentId);
    if (!student) throw new AppError('class_not_found');
    return {
      classId: item.id,
      className: item.name,
      classYearLevel: item.yearLevel,
      yearLevel: student.yearLevel,
      teacherName: teacherName(item),
      studentsCanLeave: item.studentsCanLeave,
      joinedAt: student.joinedAt,
    };
  }

  function sendEmail(email: string, type: EmailLinkType) {
    const token = `${type}-token-${state.sentEmails.length + 1}`;
    state.emailLinks.set(token, { email, type });
    state.sentEmails.push({ to: email, type });
  }

  const signedOutListeners = new Set<() => void>();

  return {
    auth: {
      getCurrentUser() {
        return Promise.resolve(current()?.user ?? null);
      },
      signIn(email, password) {
        const found = state.accounts.get(email.trim());
        if (found?.password !== password) {
          return Promise.reject(new AppError('invalid_credentials'));
        }
        if (!found.confirmed) return Promise.reject(new AppError('email_not_confirmed'));
        state.signedInEmail = found.user.email;
        return Promise.resolve();
      },
      register({ email, password, role, firstName, lastName }) {
        if (!state.accounts.has(email)) {
          state.accounts.set(email, {
            user: { id: `user-${email}`, email, registration: { role, firstName, lastName } },
            password,
            confirmed: false,
            profile: null,
          });
        }
        sendEmail(email, 'email');
        return Promise.resolve();
      },
      resendConfirmation(email) {
        sendEmail(email, 'email');
        return Promise.resolve();
      },
      confirmEmailLink(tokenHash, type) {
        const link = state.emailLinks.get(tokenHash);
        if (link?.type !== type) return Promise.reject(new AppError('link_invalid'));
        state.emailLinks.delete(tokenHash);
        const found = state.accounts.get(link.email);
        if (!found) return Promise.reject(new AppError('link_invalid'));
        found.confirmed = true;
        state.signedInEmail = found.user.email;
        return Promise.resolve();
      },
      isGoogleSignInAvailable() {
        return Promise.resolve(state.googleAvailable);
      },
      startGoogleSignIn() {
        return state.googleAvailable
          ? Promise.resolve()
          : Promise.reject(new AppError('google_unavailable'));
      },
      completeGoogleSignIn(code) {
        return code === 'valid-google-code'
          ? Promise.resolve()
          : Promise.reject(new AppError('link_invalid'));
      },
      requestPasswordReset(email) {
        if (state.accounts.has(email.trim())) sendEmail(email.trim(), 'recovery');
        return Promise.resolve();
      },
      updatePassword(password) {
        const found = current();
        if (!found) return Promise.reject(new AppError('not_signed_in'));
        if (found.password === password) return Promise.reject(new AppError('same_password'));
        found.password = password;
        return Promise.resolve();
      },
      signOut() {
        state.signedInEmail = null;
        for (const listener of signedOutListeners) listener();
        return Promise.resolve();
      },
      onSignedOut(listener) {
        signedOutListeners.add(listener);
        return () => signedOutListeners.delete(listener);
      },
    },

    accounts: {
      getMyProfile() {
        return Promise.resolve(current()?.profile ?? null);
      },
      completeProfile(details) {
        const found = current();
        if (!found) return Promise.reject(new AppError('not_signed_in'));
        if (found.profile) return Promise.reject(new AppError('profile_exists'));
        found.profile = { id: found.user.id, ...details };
        return Promise.resolve(found.profile);
      },
    },

    classes: {
      async listMyClasses() {
        await Promise.resolve();
        const student = requireRole('student');
        return state.classes
          .filter((item) => item.students.some((entry) => entry.studentId === student.id))
          .map((item) => membership(item, student.id));
      },
      async joinClass(code) {
        await Promise.resolve();
        const student = requireRole('student');
        if (!isValidJoinCode(code)) throw new AppError('invalid_join_code');
        const target = state.classes.find((item) => item.joinCode === normalizeJoinCode(code));
        if (!target) throw new AppError('join_code_not_found');
        if (!target.joiningEnabled) throw new AppError('joining_closed');
        if (target.students.some((entry) => entry.studentId === student.id)) {
          throw new AppError('already_member');
        }
        target.students.push({
          studentId: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          yearLevel: target.yearLevel,
          joinedAt: TEST_NOW.toISOString(),
        });
        return membership(target, student.id);
      },
      async leaveClass(classId) {
        await Promise.resolve();
        const student = requireRole('student');
        const target = state.classes.find((item) => item.id === classId);
        if (!target?.students.some((entry) => entry.studentId === student.id)) {
          throw new AppError('class_not_found');
        }
        if (!target.studentsCanLeave) throw new AppError('leaving_not_allowed');
        target.students = target.students.filter((entry) => entry.studentId !== student.id);
      },
      async listTeacherClasses() {
        await Promise.resolve();
        const teacher = requireRole('teacher');
        return state.classes.filter((item) => item.teacherId === teacher.id).map(teacherView);
      },
      async createClass(name, yearLevel) {
        await Promise.resolve();
        const teacher = requireRole('teacher');
        const created: FakeClass = {
          id: `class-${state.classes.length + 1}`,
          name,
          yearLevel,
          joinCode: `NEWC${String(state.classes.length + 2).padStart(4, '2')}`.slice(0, 8),
          joiningEnabled: true,
          studentsCanLeave: true,
          studentCount: 0,
          createdAt: TEST_NOW.toISOString(),
          teacherId: teacher.id,
          students: [],
        };
        state.classes.unshift(created);
        return teacherView(created);
      },
      async getTeacherClass(classId) {
        await Promise.resolve();
        return teacherView(ownClass(classId));
      },
      async updateClass(classId, settings) {
        await Promise.resolve();
        const target = ownClass(classId);
        const previousLevel = target.yearLevel;
        Object.assign(target, settings);
        for (const student of target.students) {
          if (student.yearLevel === previousLevel) student.yearLevel = settings.yearLevel;
        }
        return teacherView(target);
      },
      async regenerateJoinCode(classId) {
        await Promise.resolve();
        const target = ownClass(classId);
        target.joinCode = target.joinCode === 'WXYZ6789' ? 'WXYZ6788' : 'WXYZ6789';
        return target.joinCode;
      },
      async listClassStudents(classId) {
        await Promise.resolve();
        return ownClass(classId).students.map((student) => ({ ...student }));
      },
      async setStudentYearLevel(classId, studentId, yearLevel) {
        await Promise.resolve();
        const student = ownClass(classId).students.find((entry) => entry.studentId === studentId);
        if (!student) throw new AppError('student_not_found');
        student.yearLevel = yearLevel;
        return { ...student };
      },
      async removeStudent(classId, studentId) {
        await Promise.resolve();
        const target = ownClass(classId);
        if (!target.students.some((entry) => entry.studentId === studentId)) {
          throw new AppError('student_not_found');
        }
        target.students = target.students.filter((entry) => entry.studentId !== studentId);
      },
    },

    studentHome: createSampleStudentHomeRepository(() => TEST_NOW),
    now: () => TEST_NOW,
  };
}

/** The short name a student's classmates see, as the app derives it. */
export const testStudentShortName = getShortName(testStudent);
