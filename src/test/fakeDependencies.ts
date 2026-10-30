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
import { checkNumericalAnswer, publishedLessons } from '@/domain/learning';
import { COIN_RULES, avatarParts, makeFreshShopState, type ShopState } from '@/domain/shop';
import { getFullName, getShortName } from '@/domain/people';
import type { YearLevel } from '@/domain/student';
import type {
  RecentCompletion,
  StudentAttemptResult,
  StudentProgressSummary,
  TopicProgress,
} from '@/domain/reports';
import type {
  LearningItem,
  StudentTask,
  TaskProgress,
  TaskStudentResult,
  TeacherTask,
} from '@/domain/tasks';
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

export interface FakeTask {
  id: string;
  classId: string;
  createdBy: string;
  requestId: string;
  title: string;
  instructions: string | null;
  contentId: string;
  audience: 'class' | 'students';
  studentIds: string[];
  state: 'draft' | 'published';
  dueAt: string;
  createdAt: string;
  publishedAt: string | null;
}

export interface FakeAttempt {
  id: string;
  studentId: string;
  contentId: string;
  startedAt: string;
  lastActivityAt: string;
  completedAt: string | null;
  questions: Map<
    string,
    { tries: number; hintsUsed: number; firstTryCorrect: boolean; solved: boolean }
  >;
}

export interface FakeState {
  tasks: FakeTask[];
  attempts: FakeAttempt[];
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
    tasks: [],
    attempts: [],
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

  /** A student's wallet, created with the welcome coins on first use, as the server does. */
  function walletOf(studentId: string): ShopState {
    let wallet = state.shopWallets.get(studentId);
    if (!wallet) {
      wallet = makeFreshShopState();
      state.shopWallets.set(studentId, wallet);
    }
    return wallet;
  }

  /** Coins for finishing a lesson, within the daily limit (every fake answer is on one day). */
  function awardLesson(studentId: string, firstTryCorrect: number): number {
    const wallet = walletOf(studentId);
    const rewarded = wallet.transactions.filter((entry) => entry.reason === 'lesson_complete');
    if (rewarded.length >= COIN_RULES.rewardedLessonsPerDay) return 0;
    const amount = COIN_RULES.lessonComplete + COIN_RULES.lessonFirstTryBonus * firstTryCorrect;
    wallet.balance += amount;
    wallet.transactions.unshift({
      id: wallet.transactions.length + 1,
      itemId: null,
      delta: amount,
      reason: 'lesson_complete',
      createdAt: TEST_NOW.toISOString(),
    });
    return amount;
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

  function catalogue(): LearningItem[] {
    return publishedLessons.map((lesson) => ({
      id: lesson.id,
      kind: 'lesson',
      title: lesson.title,
      strand: lesson.strand,
      topic: 'Linear equations',
      yearLevel: lesson.yearLevel,
      questionCount: lesson.questions.length,
      estimatedMinutes: lesson.estimatedMinutes,
    }));
  }

  function ownTask(taskId: string): FakeTask {
    const teacher = requireRole('teacher');
    const task = state.tasks.find((entry) => entry.id === taskId);
    const taught =
      task &&
      state.classes.some((item) => item.id === task.classId && item.teacherId === teacher.id);
    if (!task || !taught) throw new AppError('task_not_found');
    return task;
  }

  /** Like the database: published, still in the class, and chosen (or the whole class). */
  function assignedStudents(task: FakeTask): ClassStudent[] {
    if (task.state !== 'published') return [];
    const target = state.classes.find((item) => item.id === task.classId);
    return (target?.students ?? []).filter(
      (student) => task.audience === 'class' || task.studentIds.includes(student.studentId),
    );
  }

  function taskResult(task: FakeTask, studentId: string) {
    const attempts = state.attempts.filter(
      (entry) =>
        entry.studentId === studentId &&
        entry.contentId === task.contentId &&
        task.publishedAt !== null &&
        entry.startedAt >= task.publishedAt,
    );
    const best = attempts.find((entry) => entry.completedAt) ?? attempts.at(-1);
    const progress: TaskProgress = !best
      ? 'not_started'
      : best.completedAt
        ? 'completed'
        : 'in_progress';
    const questions = best ? [...best.questions.values()] : [];
    return {
      progress,
      completedAt: best?.completedAt ?? null,
      lastActivityAt: best?.lastActivityAt ?? null,
      questionsSolved: questions.filter((item) => item.solved).length,
      firstTryCorrect: questions.filter((item) => item.firstTryCorrect).length,
    };
  }

  function attemptsIn(studentId: string, since: Date | null): FakeAttempt[] {
    return state.attempts.filter(
      (attempt) =>
        attempt.studentId === studentId &&
        (!since || Date.parse(attempt.lastActivityAt) >= since.getTime()),
    );
  }

  function teacherTaskView(task: FakeTask): TeacherTask {
    const target = state.classes.find((item) => item.id === task.classId);
    const lesson = catalogue().find((item) => item.id === task.contentId);
    const results = assignedStudents(task).map((student) => taskResult(task, student.studentId));
    return {
      id: task.id,
      classId: task.classId,
      className: target?.name ?? '',
      title: task.title,
      instructions: task.instructions,
      contentId: task.contentId,
      contentTitle: lesson?.title ?? '',
      contentKind: lesson?.kind ?? 'lesson',
      state: task.state,
      audience: task.audience,
      dueAt: task.dueAt,
      createdAt: task.createdAt,
      publishedAt: task.publishedAt,
      assignedCount: results.length,
      completedCount: results.filter((item) => item.progress === 'completed').length,
      inProgressCount: results.filter((item) => item.progress === 'in_progress').length,
    };
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
        return structuredClone(walletOf(student.id));
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
          id: snapshot.transactions.length + 1,
          itemId,
          delta: -item.price,
          reason: 'purchase',
          createdAt: TEST_NOW.toISOString(),
        });
        state.shopWallets.set(student.id, snapshot);
        return structuredClone(snapshot);
      },
      async equip(category, itemId) {
        const student = requireRole('student');
        const snapshot = await this.getState();
        if (
          itemId &&
          !snapshot.items.some(
            (item) =>
              item.id === itemId && item.category === category && snapshot.owned.includes(itemId),
          )
        )
          throw new AppError('shop_not_owned');
        snapshot.equipped = itemId
          ? { ...snapshot.equipped, [category]: itemId }
          : Object.fromEntries(
              Object.entries(snapshot.equipped).filter(([key]) => key !== category),
            );
        state.shopWallets.set(student.id, snapshot);
        return structuredClone(snapshot);
      },
      async resetLook() {
        const student = requireRole('student');
        const snapshot = await this.getState();
        snapshot.equipped = {};
        state.shopWallets.set(student.id, snapshot);
        return structuredClone(snapshot);
      },
      async awardAnswer(questionId, answer) {
        const student = requireRole('student');
        if (
          !state.classes.some((item) =>
            item.students.some(
              (member) => member.studentId === student.id && member.yearLevel === 9,
            ),
          )
        )
          throw new AppError('shop_lesson_unavailable');
        const correct: Record<string, number> = {
          'eq-1': 5,
          'eq-2': 5,
          'eq-3': -3,
          'eq-4': 5,
          'eq-5': -4,
        };
        const expected = correct[questionId];
        if (expected === undefined) throw new AppError('shop_question_unavailable');
        if (!checkNumericalAnswer(answer, expected)) {
          throw new AppError('shop_answer_incorrect');
        }
        const awarded = state.rewardedQuestions.get(student.id) ?? new Set<string>();
        if (awarded.has(questionId)) throw new AppError('shop_already_rewarded');
        awarded.add(questionId);
        state.rewardedQuestions.set(student.id, awarded);
        const snapshot = await this.getState();
        snapshot.balance += 20;
        snapshot.transactions.unshift({
          id: snapshot.transactions.length + 1,
          itemId: null,
          delta: 20,
          reason: 'correct_answer',
          createdAt: TEST_NOW.toISOString(),
        });
        state.shopWallets.set(student.id, snapshot);
        return structuredClone(snapshot);
      },
      async classLooks(classId) {
        await Promise.resolve();
        const target = ownClass(classId);
        return Object.fromEntries(
          target.students.map(({ studentId }) => [
            studentId,
            avatarParts(state.shopWallets.get(studentId)?.equipped ?? {}),
          ]),
        );
      },
    },
    tasks: {
      async listCatalogue() {
        await Promise.resolve();
        requireProfile();
        return catalogue();
      },
      async createTask(input) {
        await Promise.resolve();
        const teacher = requireRole('teacher');
        const target = ownClass(input.classId);
        const existing = state.tasks.find(
          (task) => task.createdBy === teacher.id && task.requestId === input.requestId,
        );
        if (existing) return teacherTaskView(existing);
        const title = input.title.trim().replace(/\s+/g, ' ');
        if (!title || title.length > 80) throw new AppError('invalid_task_title');
        const instructions = input.instructions.trim();
        if (instructions.length > 500) throw new AppError('invalid_instructions');
        if (!catalogue().some((item) => item.id === input.contentId && item.kind === 'lesson')) {
          throw new AppError('content_unavailable');
        }
        const due = Date.parse(input.dueAt);
        if (!Number.isFinite(due) || due <= TEST_NOW.getTime()) {
          throw new AppError('invalid_due_date');
        }
        if (
          input.studentIds &&
          (input.studentIds.length === 0 ||
            input.studentIds.some(
              (id) => !target.students.some((student) => student.studentId === id),
            ))
        ) {
          throw new AppError('invalid_students');
        }
        const created: FakeTask = {
          id: `task-${state.tasks.length + 1}`,
          classId: target.id,
          createdBy: teacher.id,
          requestId: input.requestId,
          title,
          instructions: instructions || null,
          contentId: input.contentId,
          audience: input.studentIds ? 'students' : 'class',
          studentIds: input.studentIds ? [...new Set(input.studentIds)] : [],
          state: input.publish ? 'published' : 'draft',
          dueAt: new Date(due).toISOString(),
          createdAt: TEST_NOW.toISOString(),
          publishedAt: input.publish ? TEST_NOW.toISOString() : null,
        };
        state.tasks.push(created);
        return teacherTaskView(created);
      },
      async publishTask(taskId) {
        await Promise.resolve();
        const task = ownTask(taskId);
        if (task.state === 'published') throw new AppError('task_already_published');
        if (Date.parse(task.dueAt) <= TEST_NOW.getTime()) throw new AppError('invalid_due_date');
        task.state = 'published';
        task.publishedAt = TEST_NOW.toISOString();
        return teacherTaskView(task);
      },
      async setDueDate(taskId, dueAt) {
        await Promise.resolve();
        const task = ownTask(taskId);
        const due = Date.parse(dueAt);
        if (!Number.isFinite(due) || due <= TEST_NOW.getTime()) {
          throw new AppError('invalid_due_date');
        }
        task.dueAt = new Date(due).toISOString();
        return teacherTaskView(task);
      },
      async deleteTask(taskId) {
        await Promise.resolve();
        const task = ownTask(taskId);
        state.tasks = state.tasks.filter((entry) => entry !== task);
      },
      async listTeacherTasks(classId) {
        await Promise.resolve();
        const teacher = requireRole('teacher');
        if (classId) ownClass(classId);
        const taught = new Set(
          state.classes.filter((item) => item.teacherId === teacher.id).map((item) => item.id),
        );
        return state.tasks
          .filter((task) => taught.has(task.classId) && (!classId || task.classId === classId))
          .sort(
            (a, b) =>
              Number(a.state === 'published') - Number(b.state === 'published') ||
              a.dueAt.localeCompare(b.dueAt),
          )
          .map(teacherTaskView);
      },
      async getTask(taskId) {
        await Promise.resolve();
        return teacherTaskView(ownTask(taskId));
      },
      async listTaskResults(taskId) {
        await Promise.resolve();
        const task = ownTask(taskId);
        const lesson = catalogue().find((item) => item.id === task.contentId);
        return assignedStudents(task)
          .map((student): TaskStudentResult => {
            const result = taskResult(task, student.studentId);
            return {
              studentId: student.studentId,
              firstName: student.firstName,
              lastName: student.lastName,
              ...result,
              questionCount: lesson?.questionCount ?? 0,
            };
          })
          .sort((a, b) => a.lastName.localeCompare(b.lastName));
      },
      async listMyTasks() {
        await Promise.resolve();
        const student = requireRole('student');
        return state.tasks
          .filter((task) => assignedStudents(task).some((entry) => entry.studentId === student.id))
          .map((task): StudentTask => {
            const target = state.classes.find((item) => item.id === task.classId);
            const lesson = catalogue().find((item) => item.id === task.contentId);
            const result = taskResult(task, student.id);
            return {
              id: task.id,
              classId: task.classId,
              className: target?.name ?? '',
              title: task.title,
              instructions: task.instructions,
              contentId: task.contentId,
              contentTitle: lesson?.title ?? '',
              contentKind: lesson?.kind ?? 'lesson',
              topic: lesson?.topic ?? '',
              questionCount: lesson?.questionCount ?? 0,
              estimatedMinutes: lesson?.estimatedMinutes ?? 0,
              dueAt: task.dueAt,
              publishedAt: task.publishedAt ?? '',
              progress: result.progress,
              completedAt: result.completedAt,
              questionsSolved: result.questionsSolved,
            };
          });
      },
    },
    progress: {
      async startAttempt(contentId) {
        await Promise.resolve();
        const student = requireRole('student');
        const lesson = catalogue().find((item) => item.id === contentId);
        const yearMatch = state.classes.some((item) =>
          item.students.some(
            (entry) => entry.studentId === student.id && entry.yearLevel === lesson?.yearLevel,
          ),
        );
        const assigned = state.tasks.some(
          (task) =>
            task.contentId === contentId &&
            assignedStudents(task).some((entry) => entry.studentId === student.id),
        );
        if (!lesson || (!yearMatch && !assigned)) throw new AppError('content_unavailable');
        const attempt: FakeAttempt = {
          id: `attempt-${state.attempts.length + 1}`,
          studentId: student.id,
          contentId,
          startedAt: TEST_NOW.toISOString(),
          lastActivityAt: TEST_NOW.toISOString(),
          completedAt: null,
          questions: new Map(),
        };
        state.attempts.push(attempt);
        return attempt.id;
      },
      async recordAnswer(attemptId, questionId, answer, hintsUsed) {
        await Promise.resolve();
        const student = requireRole('student');
        const attempt = state.attempts.find(
          (entry) => entry.id === attemptId && entry.studentId === student.id,
        );
        if (!attempt) throw new AppError('attempt_not_found');
        const lesson = publishedLessons.find((item) => item.id === attempt.contentId);
        const question = lesson?.questions.find((item) => item.id === questionId);
        if (!lesson || !question) throw new AppError('question_not_found');
        if (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(answer.trim().replaceAll('−', '-'))) {
          throw new AppError('invalid_answer');
        }
        const correct = checkNumericalAnswer(answer, question.solution);
        const saved = attempt.questions.get(questionId);
        if (saved?.solved) {
          return {
            correct,
            alreadySolved: true,
            completed: attempt.completedAt !== null,
            coinsAwarded: 0,
          };
        }
        attempt.questions.set(questionId, {
          tries: (saved?.tries ?? 0) + 1,
          hintsUsed: Math.max(saved?.hintsUsed ?? 0, hintsUsed),
          firstTryCorrect: saved ? saved.firstTryCorrect : correct,
          solved: correct,
        });
        attempt.lastActivityAt = TEST_NOW.toISOString();
        const completed = lesson.questions.every((item) => attempt.questions.get(item.id)?.solved);
        let coinsAwarded = 0;
        if (completed && attempt.completedAt === null) {
          attempt.completedAt = TEST_NOW.toISOString();
          const firstTry = [...attempt.questions.values()].filter((item) => item.firstTryCorrect);
          coinsAwarded = awardLesson(student.id, firstTry.length);
        }
        return { correct, alreadySolved: false, completed, coinsAwarded };
      },
    },
    reports: {
      async classProgress(classId, since) {
        await Promise.resolve();
        const target = ownClass(classId);
        return [...target.students]
          .sort((a, b) => a.lastName.localeCompare(b.lastName))
          .map((student): StudentProgressSummary => {
            const attempts = attemptsIn(student.studentId, since);
            const answers = attempts.flatMap((attempt) => [...attempt.questions.values()]);
            const tasks = state.tasks.filter(
              (task) =>
                task.classId === classId &&
                assignedStudents(task).some((entry) => entry.studentId === student.studentId) &&
                (!since || Date.parse(task.dueAt) >= since.getTime()),
            );
            return {
              studentId: student.studentId,
              firstName: student.firstName,
              lastName: student.lastName,
              yearLevel: student.yearLevel,
              lessonsCompleted: new Set(
                attempts.filter((item) => item.completedAt).map((item) => item.contentId),
              ).size,
              questionsAnswered: answers.length,
              firstTryCorrect: answers.filter((item) => item.firstTryCorrect).length,
              hintsUsed: answers.reduce((sum, item) => sum + item.hintsUsed, 0),
              tasksAssigned: tasks.length,
              tasksCompleted: tasks.filter(
                (task) => taskResult(task, student.studentId).progress === 'completed',
              ).length,
              lastActiveAt:
                attempts
                  .map((item) => item.lastActivityAt)
                  .sort()
                  .at(-1) ?? null,
            };
          });
      },
      async studentResults(classId, studentId, since) {
        await Promise.resolve();
        const target = ownClass(classId);
        if (!target.students.some((entry) => entry.studentId === studentId)) {
          throw new AppError('student_not_found');
        }
        return attemptsIn(studentId, since)
          .filter((attempt) => attempt.questions.size > 0)
          .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt))
          .map((attempt): StudentAttemptResult => {
            const lesson = catalogue().find((item) => item.id === attempt.contentId);
            const answers = [...attempt.questions.values()];
            return {
              attemptId: attempt.id,
              contentId: attempt.contentId,
              contentTitle: lesson?.title ?? '',
              strand: lesson?.strand ?? '',
              topic: lesson?.topic ?? '',
              startedAt: attempt.startedAt,
              lastActivityAt: attempt.lastActivityAt,
              completedAt: attempt.completedAt,
              questionCount: lesson?.questionCount ?? 0,
              questionsAnswered: answers.length,
              firstTryCorrect: answers.filter((item) => item.firstTryCorrect).length,
              hintsUsed: answers.reduce((sum, item) => sum + item.hintsUsed, 0),
            };
          });
      },
      async topicProgress(classId, since) {
        await Promise.resolve();
        const target = ownClass(classId);
        const ids = new Set(target.students.map((entry) => entry.studentId));
        const attempts = state.attempts.filter(
          (attempt) =>
            ids.has(attempt.studentId) &&
            attempt.questions.size > 0 &&
            (!since || Date.parse(attempt.lastActivityAt) >= since.getTime()),
        );
        return catalogue()
          .filter((item) => attempts.some((attempt) => attempt.contentId === item.id))
          .map((item): TopicProgress => {
            const mine = attempts.filter((attempt) => attempt.contentId === item.id);
            const answers = mine.flatMap((attempt) => [...attempt.questions.values()]);
            return {
              contentId: item.id,
              contentTitle: item.title,
              strand: item.strand,
              topic: item.topic,
              classSize: target.students.length,
              studentsStarted: new Set(mine.map((attempt) => attempt.studentId)).size,
              studentsCompleted: new Set(
                mine.filter((attempt) => attempt.completedAt).map((attempt) => attempt.studentId),
              ).size,
              questionsAnswered: answers.length,
              firstTryCorrect: answers.filter((answer) => answer.firstTryCorrect).length,
            };
          });
      },
      async recentCompletions() {
        await Promise.resolve();
        const teacher = requireRole('teacher');
        const rows: RecentCompletion[] = [];
        for (const item of state.classes.filter((entry) => entry.teacherId === teacher.id)) {
          for (const student of item.students) {
            for (const attempt of state.attempts) {
              if (attempt.studentId !== student.studentId || !attempt.completedAt) continue;
              const lesson = catalogue().find((entry) => entry.id === attempt.contentId);
              rows.push({
                studentId: student.studentId,
                firstName: student.firstName,
                lastName: student.lastName,
                classId: item.id,
                className: item.name,
                contentTitle: lesson?.title ?? '',
                completedAt: attempt.completedAt,
                questionCount: lesson?.questionCount ?? 0,
                firstTryCorrect: [...attempt.questions.values()].filter(
                  (answer) => answer.firstTryCorrect,
                ).length,
              });
            }
          }
        }
        return rows.sort((a, b) => b.completedAt.localeCompare(a.completedAt)).slice(0, 6);
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

/** Adds a published task for the test class (whole class by default), like a teacher would. */
export function addFakeTask(state: FakeState, overrides: Partial<FakeTask> = {}): FakeTask {
  const task: FakeTask = {
    id: `task-${state.tasks.length + 1}`,
    classId: 'class-9m2',
    createdBy: `user-${testTeacher.email}`,
    requestId: `request-${state.tasks.length + 1}`,
    title: 'Linear equations homework',
    instructions: null,
    contentId: 'linear-equations-basics',
    audience: 'class',
    studentIds: [],
    state: 'published',
    dueAt: new Date(2026, 9, 30, 23, 59).toISOString(),
    createdAt: new Date(2026, 9, 26).toISOString(),
    publishedAt: new Date(2026, 9, 26).toISOString(),
    ...overrides,
  };
  state.tasks.push(task);
  return task;
}

/** Saves progress on a lesson as the server would: `solved` questions right, the first `wrong` of them after a mistake. */
export function addFakeAttempt(
  state: FakeState,
  {
    studentId = `user-${testStudent.email}`,
    contentId = 'linear-equations-basics',
    solved = 0,
    wrong = 0,
    at = new Date(2026, 9, 27),
  }: { studentId?: string; contentId?: string; solved?: number; wrong?: number; at?: Date } = {},
): FakeAttempt {
  const lesson = publishedLessons.find((item) => item.id === contentId);
  const questions = new Map<
    string,
    { tries: number; hintsUsed: number; firstTryCorrect: boolean; solved: boolean }
  >();
  lesson?.questions.slice(0, solved).forEach((question, i) => {
    questions.set(question.id, {
      tries: i < wrong ? 2 : 1,
      hintsUsed: 0,
      firstTryCorrect: i >= wrong,
      solved: true,
    });
  });
  const attempt: FakeAttempt = {
    id: `attempt-${state.attempts.length + 1}`,
    studentId,
    contentId,
    startedAt: at.toISOString(),
    lastActivityAt: at.toISOString(),
    completedAt: lesson && solved >= lesson.questions.length ? at.toISOString() : null,
    questions,
  };
  state.attempts.push(attempt);
  return attempt;
}
