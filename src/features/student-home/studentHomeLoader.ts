import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import type { AppDependencies } from '@/data/repositories';
import type { StudentHome } from '@/domain/studentHome';

export interface StudentHomeLoaderData {
  home: StudentHome;
  /** When the data was loaded; due dates and greetings are worked out from this moment. */
  now: Date;
}

export function createStudentHomeLoader({
  studentRepository,
  now,
}: Pick<AppDependencies, 'studentRepository' | 'now'>) {
  return async ({ request }: LoaderFunctionArgs): Promise<StudentHomeLoaderData> => ({
    home: await studentRepository.getStudentHome({ signal: request.signal }),
    now: now(),
  });
}

export function useStudentHomeData(): StudentHomeLoaderData {
  return useLoaderData<StudentHomeLoaderData>();
}
