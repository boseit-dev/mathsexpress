import type { TeacherRepository } from '../repositories';
import { respond } from './respond';
import { sampleTeacher } from './sampleTeacher';

export function createSampleTeacherRepository(): TeacherRepository {
  return {
    getCurrentTeacher: (options) => respond(sampleTeacher, options),
  };
}
