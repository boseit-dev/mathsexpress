import type { AppDependencies } from './repositories';
import { createSampleStudentRepository } from './sample/sampleStudentRepository';
import { createSampleTeacherRepository } from './sample/sampleTeacherRepository';

/**
 * Builds the app's data sources. Phase 1 has no backend, so everything comes from development
 * sample data; real repositories will be swapped in here without changing any page.
 */
export function createAppDependencies(now: () => Date = () => new Date()): AppDependencies {
  return {
    studentRepository: createSampleStudentRepository(now),
    teacherRepository: createSampleTeacherRepository(),
    now,
  };
}
