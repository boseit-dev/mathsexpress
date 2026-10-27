import type { StudentRepository } from '../repositories';
import { respond } from './respond';
import { sampleStudent } from './sampleStudent';

export function createSampleStudentRepository(): StudentRepository {
  return {
    getCurrentStudent: (options) => respond(sampleStudent, options),
  };
}
