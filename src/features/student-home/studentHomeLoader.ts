import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { requireAccount } from '@/app/auth/guards';
import type { AppDependencies } from '@/data/repositories';
import { getShortName } from '@/domain/people';
import type { StudentHome } from '@/domain/studentHome';

export interface StudentHomeLoaderData {
  home: StudentHome;
  /** When the data was loaded; due dates and greetings are worked out from this moment. */
  now: Date;
}

export function createStudentHomeLoader(dependencies: AppDependencies) {
  return async ({ request }: LoaderFunctionArgs): Promise<StudentHomeLoaderData> => {
    const { profile } = await requireAccount(dependencies, request, 'student');
    const home = await dependencies.studentHome.getStudentHome(
      { id: profile.id, displayName: getShortName(profile) },
      { signal: request.signal },
    );
    return { home, now: dependencies.now() };
  };
}

export function useStudentHomeData(): StudentHomeLoaderData {
  return useLoaderData<StudentHomeLoaderData>();
}
