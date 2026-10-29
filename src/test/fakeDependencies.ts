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
import { checkNumericalAnswer } from '@/domain/learning';
import { makeFreshShopState, type ShopState } from '@/domain/shop';
import { getFullName, getShortName } from '@/domain/people';
import type { YearLevel } from '@/domain/student';
import { createSampleStudentHomeRepository } from '@/data/sample/sampleStudentHomeRepository';
import type { AppDependencies, EmailLinkType } from '@/data/repositories';

/** A fixed "now" for tests: Wednesday 28 October 2026, 3:30 pm in Sydney. */
export const TEST_NOW = new Date(2026, 9, 28, 15, 30);

export const TEST_PASSWORD = 'maths-test-1';

const DAY_MS = 24 * 60 * 60 * 1000;

interface FakeAccount {
  user: AuthUser;
  password: string;
  confirmed: boolean;
  profile: Profile | null;
}

interface FakeClass extends TeacherClass {
  teacherId: string;
  students: ClassStudent[];
  /** Students who left or were removed, with the level to give back if they rejoin. */
  formerStudents: Map<string, { yearLevel: YearLevel; followedClassLevel: boolean }>;
}

export interface FakeState {
  accounts: Map<string, FakeAccount>;
  classes: FakeClass[];
  signedInEmail: string | null;
  /**
   * When the current session signed in through an email link or Google (ms since 1970), as the
   * real session token records it; null after a password sign-in.
   */
  emailSignInAt: number | null;
  googleAvailable: boolean;
  /** Email-link tokens that are still valid, by token. */
  emailLinks: Map<string, { email: string; type: EmailLinkType }>;
  sentEmails: { to: string; type: EmailLinkType }[];
  /** Notified when the session ends elsewhere; see endSessionElsewhere. */
  signedOutListeners: Set<() => void>;
  shopWallets: Map<string, ShopState>;
  rewardedQuestions: Map<string, Set<string>>;
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
        formerStudents: new Map(),
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
    emailSignInAt: null,
    googleAvailable: false,
    emailLinks: new Map(),
    sentEmails: [],
    signedOutListeners: new Set(),
    shopWallets: new Map(),
    rewardedQuestions: new Map(),
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

  function teacherName(item: FakeClass): string | null {
    const teacher = [...state.accounts.values()].find((entry) => entry.user.id === item.teacherId);
    return teacher?.profile ? getFullName(teacher.profile) : null;
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

  /** Removes a student from a class, remembering their level as the database does. */
  function forget(target: FakeClass, studentId: string) {
    const leaving = target.students.find((entry) => entry.studentId === studentId);
    if (leaving) {
      target.formerStudents.set(studentId, {
        yearLevel: leaving.yearLevel,
        followedClassLevel: leaving.yearLevel === target.yearLevel,
      });
    }
    target.students = target.students.filter((entry) => entry.studentId !== studentId);
  }

  function sendEmail(email: string, type: EmailLinkType) {
    const token = `${type}-token-${state.sentEmails.length + 1}`;
    state.emailLinks.set(token, { email, type });
    state.sentEmails.push({ to: email, type });
  }

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
        // Like the sign-in hook: a password opens no session until the account is set up.
        if (!found.profile) return Promise.reject(new AppError('email_link_required'));
        state.signedInEmail = found.user.email;
        state.emailSignInAt = null;
        return Promise.resolve();
      },
      // Like the auth server, registering again before confirming keeps the first details and
      // password, and just sends the email again.
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
        state.emailSignInAt = Date.now();
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
        if (code !== 'valid-google-code') return Promise.reject(new AppError('link_invalid'));
        state.emailSignInAt = Date.now();
        return Promise.resolve();
      },
      // Like the auth server, which limits how often it emails one address: only real accounts
      // are ever emailed, so only they can hit the limit.
      requestPasswordReset(email) {
        const address = email.trim();
        if (!state.accounts.has(address)) return Promise.resolve();
        const alreadySent = state.sentEmails.some(
          (sent) => sent.to === address && sent.type === 'recovery',
        );
        if (alreadySent) return Promise.reject(new AppError('rate_limited'));
        sendEmail(address, 'recovery');
        return Promise.resolve();
      },
      emailSignInAge() {
        const at = state.signedInEmail === null ? null : state.emailSignInAt;
        return Promise.resolve(at === null ? null : Math.floor((Date.now() - at) / 1000));
      },
      updatePassword(password) {
        const found = current();
        if (!found) return Promise.reject(new AppError('not_signed_in'));
        if (found.password === password) return Promise.reject(new AppError('same_password'));
        found.password = password;
        return Promise.resolve();
      },
      // Like the real service, the app's own sign-out is not reported to onSignedOut.
      signOut() {
        state.signedInEmail = null;
        state.emailSignInAt = null;
        return Promise.resolve();
      },
      onSignedOut(listener) {
        state.signedOutListeners.add(listener);
        return () => state.signedOutListeners.delete(listener);
      },
    },

    accounts: {
      getMyProfile() {
        return Promise.resolve(current()?.profile ?? null);
      },
      completeProfile(details) {
        const found = current();
        if (!found) return Promise.reject(new AppError('not_signed_in'));
        // Like the database: only a session from an email link (or Google) in the last day may set
        // up an account.
        if (state.emailSignInAt === null || Date.now() - state.emailSignInAt >= DAY_MS) {
          return Promise.reject(new AppError('email_link_required'));
        }
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
        // Like the database: a returning student gets back the level they had.
        const former = target.formerStudents.get(student.id);
        target.formerStudents.delete(student.id);
        target.students.push({
          studentId: student.id,
          firstName: student.firstName,
          lastName: student.lastName,
          yearLevel: former && !former.followedClassLevel ? former.yearLevel : target.yearLevel,
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
        forget(target, student.id);
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
          formerStudents: new Map(),
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
        forget(target, studentId);
      },
    },

    studentHome: createSampleStudentHomeRepository(() => TEST_NOW),
    shop: {
      async getState() {
        await Promise.resolve();
        const student = requireRole('student');
        if (!state.shopWallets.has(student.id)) {
          state.shopWallets.set(student.id, makeFreshShopState());
        }
        return structuredClone(state.shopWallets.get(student.id)!);
      },
      async buy(itemId) {
        const student = requireRole('student');
        const snapshot = await this.getState();
        const item = snapshot.items.find((entry) => entry.id === itemId);
        if (!item) throw new AppError('shop_item_unavailable');
        if (snapshot.owned.includes(itemId)) throw new AppError('shop_already_owned');
        if (snapshot.balance < item.price) throw new AppError('shop_not_enough_coins');
        snapshot.balance -= item.price;
        snapshot.owned.push(itemId);
        snapshot.transactions.unshift({
          id: snapshot.transactions.length + 1, itemId, delta: -item.price,
          reason: 'purchase', createdAt: TEST_NOW.toISOString(),
        });
        state.shopWallets.set(student.id, snapshot);
        return structuredClone(snapshot);
      },
      async equip(category, itemId) {
        const student = requireRole('student');
        const snapshot = await this.getState();
        if (category !== 'theme' && category !== 'frame') throw new AppError('shop_invalid_category');
        if (itemId && !snapshot.items.some((item) =>
          item.id === itemId && item.category === category && snapshot.owned.includes(itemId)
        )) throw new AppError('shop_not_owned');
        if (category === 'theme') snapshot.equippedTheme = itemId;
        else snapshot.equippedFrame = itemId;
        state.shopWallets.set(student.id, snapshot);
        return structuredClone(snapshot);
      },
      async awardAnswer(questionId, answer) {
        const student = requireRole('student');
        if (!state.classes.some((item) =>
          item.students.some((member) => member.studentId === student.id && member.yearLevel === 9)
        )) throw new AppError('shop_lesson_unavailable');
        const correct: Record<string, number> = {
          'eq-1': 5, 'eq-2': 5, 'eq-3': -3, 'eq-4': 5, 'eq-5': -4,
        };
        if (!(questionId in correct)) throw new AppError('shop_question_unavailable');
        if (!checkNumericalAnswer(answer, correct[questionId]!)) {
          throw new AppError('shop_answer_incorrect');
        }
        const awarded = state.rewardedQuestions.get(student.id) ?? new Set<string>();
        if (awarded.has(questionId)) throw new AppError('shop_already_rewarded');
        awarded.add(questionId);
        state.rewardedQuestions.set(student.id, awarded);
        const snapshot = await this.getState();
        snapshot.balance += 20;
        snapshot.transactions.unshift({
          id: snapshot.transactions.length + 1, itemId: null, delta: 20,
          reason: 'correct_answer', createdAt: TEST_NOW.toISOString(),
        });
        state.shopWallets.set(student.id, snapshot);
        return structuredClone(snapshot);
      },
    },
    now: () => TEST_NOW,
  };
}

/** Ends the session the way signing out in another tab (or the server ending it) would. */
export function endSessionElsewhere(state: FakeState) {
  state.signedInEmail = null;
  state.emailSignInAt = null;
  for (const listener of state.signedOutListeners) listener();
}

/** The short name a student's classmates see, as the app derives it. */
export const testStudentShortName = getShortName(testStudent);
