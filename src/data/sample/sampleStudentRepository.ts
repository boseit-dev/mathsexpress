import type { StudentRepository } from '../repositories';
import { respond } from './respond';
import { sampleStudent } from './sampleStudent';
import { createSampleStudentHome } from './sampleStudentHome';

export function createSampleStudentRepository(now: () => Date): StudentRepository {
  return {
    getCurrentStudent: (options) => respond(sampleStudent, options),
    getStudentHome: (options) => respond(createSampleStudentHome(now()), options),
  };
}
