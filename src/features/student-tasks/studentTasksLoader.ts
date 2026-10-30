import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { requireAccount } from '@/app/auth/guards';
import type { AppDependencies } from '@/data/repositories';
import type { StudentTask } from '@/domain/tasks';

export interface StudentTasksData {
  tasks: StudentTask[];
  now: Date;
}

export function createStudentTasksLoader(dependencies: AppDependencies) {
  return async ({ request }: LoaderFunctionArgs): Promise<StudentTasksData> => {
    await requireAccount(dependencies, request, 'student');
    const tasks = await dependencies.tasks.listMyTasks({ signal: request.signal });
    return { tasks, now: dependencies.now() };
  };
}

export function useStudentTasksData(): StudentTasksData {
  return useLoaderData<StudentTasksData>();
}
