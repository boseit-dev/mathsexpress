import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { requireAccount } from '@/app/auth/guards';
import type { AppDependencies } from '@/data/repositories';
import { getShortName } from '@/domain/people';
import type { StudentHome } from '@/domain/studentHome';
import type { StudentTask } from '@/domain/tasks';

export interface StudentHomeLoaderData {
  home: StudentHome;
  /** The student's real tasks from their teachers. */
  tasks: StudentTask[];
  /** When the data was loaded; due dates and greetings are worked out from this moment. */
  now: Date;
}

export function createStudentHomeLoader(dependencies: AppDependencies) {
  return async ({ request }: LoaderFunctionArgs): Promise<StudentHomeLoaderData> => {
    const { profile } = await requireAccount(dependencies, request, 'student');
    const [home, tasks] = await Promise.all([
      dependencies.studentHome.getStudentHome(
        { id: profile.id, displayName: getShortName(profile) },
        { signal: request.signal },
      ),
      dependencies.tasks.listMyTasks({ signal: request.signal }),
    ]);
    return { home, tasks, now: dependencies.now() };
  };
}

export function useStudentHomeData(): StudentHomeLoaderData {
  return useLoaderData<StudentHomeLoaderData>();
}
