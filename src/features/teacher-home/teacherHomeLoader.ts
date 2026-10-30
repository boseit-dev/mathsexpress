import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { requireAccount } from '@/app/auth/guards';
import type { AppDependencies } from '@/data/repositories';
import type { TeacherClass } from '@/domain/classes';

export interface TeacherHomeData {
  classes: TeacherClass[];
  now: Date;
}

/** Everything on the teacher's home page comes from their real classes; nothing is sample data. */
export function createTeacherHomeLoader(dependencies: AppDependencies) {
  return async ({ request }: LoaderFunctionArgs): Promise<TeacherHomeData> => {
    await requireAccount(dependencies, request, 'teacher');
    const classes = await dependencies.classes.listTeacherClasses({ signal: request.signal });
    return { classes, now: dependencies.now() };
  };
}

export function useTeacherHomeData(): TeacherHomeData {
  return useLoaderData<TeacherHomeData>();
}
