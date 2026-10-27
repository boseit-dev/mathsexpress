import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import type { TeacherRepository } from '@/data/repositories';
import type { CurrentTeacher } from '@/domain/teacher';

export function createTeacherLayoutLoader(teacherRepository: TeacherRepository) {
  return ({ request }: LoaderFunctionArgs): Promise<CurrentTeacher> =>
    teacherRepository.getCurrentTeacher({ signal: request.signal });
}

/** The data returned by the teacher layout's loader. Use only inside TeacherLayout. */
export function useTeacherLayoutData(): CurrentTeacher {
  return useLoaderData<CurrentTeacher>();
}
