import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import type { StudentRepository } from '@/data/repositories';
import type { CurrentStudent } from '@/domain/student';

export function createStudentLayoutLoader(studentRepository: StudentRepository) {
  return ({ request }: LoaderFunctionArgs): Promise<CurrentStudent> =>
    studentRepository.getCurrentStudent({ signal: request.signal });
}

/** The data returned by the student layout's loader. Use only inside StudentLayout. */
export function useStudentLayoutData(): CurrentStudent {
  return useLoaderData<CurrentStudent>();
}
