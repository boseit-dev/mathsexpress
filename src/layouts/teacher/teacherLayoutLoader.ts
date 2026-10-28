import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { requireAccount } from '@/app/auth/guards';
import type { AppDependencies } from '@/data/repositories';
import type { CurrentTeacher } from '@/domain/teacher';

/** Loads the signed-in teacher; anyone else is redirected. */
export function createTeacherLayoutLoader(dependencies: AppDependencies) {
  return async ({ request }: LoaderFunctionArgs): Promise<CurrentTeacher> => {
    const { profile } = await requireAccount(dependencies, request, 'teacher');
    return { id: profile.id, firstName: profile.firstName, lastName: profile.lastName };
  };
}

/** The data returned by the teacher layout's loader. Use only inside TeacherLayout. */
export function useTeacherLayoutData(): CurrentTeacher {
  return useLoaderData<CurrentTeacher>();
}
