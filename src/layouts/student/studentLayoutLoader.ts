import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { requireAccount } from '@/app/auth/guards';
import type { AppDependencies } from '@/data/repositories';
import { getShortName } from '@/domain/people';
import type { CurrentStudent } from '@/domain/student';

/** Loads the signed-in student and their classes; anyone else is redirected. */
export function createStudentLayoutLoader(dependencies: AppDependencies) {
  return async ({ request }: LoaderFunctionArgs): Promise<CurrentStudent> => {
    const { profile } = await requireAccount(dependencies, request, 'student');
    const classes = await dependencies.classes.listMyClasses({ signal: request.signal });
    return {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      displayName: getShortName(profile),
      classes,
    };
  };
}

/** The data returned by the student layout's loader. Use only inside StudentLayout. */
export function useStudentLayoutData(): CurrentStudent {
  return useLoaderData<CurrentStudent>();
}
