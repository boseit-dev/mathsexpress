// Contracts between the app and its data source. Pages and loaders depend on these interfaces
// only, so the sample implementations can be replaced by a real backend without UI changes.
import type { CurrentStudent } from '@/domain/student';
import type { CurrentTeacher } from '@/domain/teacher';

export interface RequestOptions {
  /** Cancels the request, e.g. when the user navigates away before it finishes. */
  signal?: AbortSignal;
}

export interface StudentRepository {
  getCurrentStudent(options?: RequestOptions): Promise<CurrentStudent>;
}

export interface TeacherRepository {
  getCurrentTeacher(options?: RequestOptions): Promise<CurrentTeacher>;
}

/** Everything the routes need from the outside world, injected so tests can replace it. */
export interface AppDependencies {
  studentRepository: StudentRepository;
  teacherRepository: TeacherRepository;
  /** The current time. Injected so date-based logic can be tested. */
  now: () => Date;
}
