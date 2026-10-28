import type { StudentHomeRepository } from '../repositories';
import { respond } from './respond';
import { createSampleStudentHome } from './sampleStudentHome';

/** Development sample data for the home page until tasks, progress and rewards are built. */
export function createSampleStudentHomeRepository(now: () => Date): StudentHomeRepository {
  return {
    getStudentHome: (student, options) => respond(createSampleStudentHome(now(), student), options),
  };
}
