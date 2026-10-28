// Contracts between the app and its data sources. Pages, loaders and actions depend only on these
// interfaces, so tests can supply fakes and the backend can change without touching the interface.
// Every method throws AppError (src/domain/errors.ts) for problems the user can act on.
import type { AuthUser, Profile, RegistrationDetails } from '@/domain/account';
import type {
  ClassSettings,
  ClassStudent,
  StudentClassMembership,
  TeacherClass,
} from '@/domain/classes';
import type { CurrentStudent, YearLevel } from '@/domain/student';
import type { StudentHome } from '@/domain/studentHome';

export interface RequestOptions {
  /** Cancels the request, e.g. when the user navigates away before it finishes. */
  signal?: AbortSignal;
}

export type EmailLinkType = 'email' | 'recovery';

export interface AuthService {
  /** The signed-in account, or null. Sessions persist and refresh across visits. */
  getCurrentUser(): Promise<AuthUser | null>;
  signIn(email: string, password: string): Promise<void>;
  /** Creates an account and sends the confirmation email. Never reveals whether it existed. */
  register(details: RegistrationDetails & { email: string; password: string }): Promise<void>;
  resendConfirmation(email: string): Promise<void>;
  /** Uses the one-time token from a confirmation or password-reset email and signs the user in. */
  confirmEmailLink(tokenHash: string, type: EmailLinkType): Promise<void>;
  isGoogleSignInAvailable(): Promise<boolean>;
  /** Leaves the app for Google; Google returns the user to /auth/callback. */
  startGoogleSignIn(): Promise<void>;
  completeGoogleSignIn(code: string): Promise<void>;
  requestPasswordReset(email: string): Promise<void>;
  updatePassword(password: string): Promise<void>;
  signOut(): Promise<void>;
  /** Calls back when the session ends, including in another tab. Returns an unsubscribe function. */
  onSignedOut(listener: () => void): () => void;
}

export interface AccountRepository {
  getMyProfile(options?: RequestOptions): Promise<Profile | null>;
  completeProfile(details: RegistrationDetails): Promise<Profile>;
}

export interface ClassRepository {
  // Students
  listMyClasses(options?: RequestOptions): Promise<StudentClassMembership[]>;
  joinClass(code: string): Promise<StudentClassMembership>;
  leaveClass(classId: string): Promise<void>;
  // Teachers
  listTeacherClasses(options?: RequestOptions): Promise<TeacherClass[]>;
  createClass(name: string, yearLevel: YearLevel): Promise<TeacherClass>;
  getTeacherClass(classId: string, options?: RequestOptions): Promise<TeacherClass>;
  updateClass(classId: string, settings: ClassSettings): Promise<TeacherClass>;
  regenerateJoinCode(classId: string): Promise<string>;
  listClassStudents(classId: string, options?: RequestOptions): Promise<ClassStudent[]>;
  setStudentYearLevel(
    classId: string,
    studentId: string,
    yearLevel: YearLevel,
  ): Promise<ClassStudent>;
  removeStudent(classId: string, studentId: string): Promise<void>;
}

/** The student home page's tasks, practice, progress and rewards (sample data in Phase 2). */
export interface StudentHomeRepository {
  getStudentHome(
    student: Pick<CurrentStudent, 'id' | 'displayName'>,
    options?: RequestOptions,
  ): Promise<StudentHome>;
}

/** Everything the routes need from the outside world, injected so tests can replace it. */
export interface AppDependencies {
  auth: AuthService;
  accounts: AccountRepository;
  classes: ClassRepository;
  studentHome: StudentHomeRepository;
  /** The current time. Injected so date-based logic can be tested. */
  now: () => Date;
}
