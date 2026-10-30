import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { requireAccount } from '@/app/auth/guards';
import type { AppDependencies } from '@/data/repositories';
import type { TeacherClass } from '@/domain/classes';
import type { RecentCompletion } from '@/domain/reports';
import type { TeacherTask } from '@/domain/tasks';

export interface TeacherHomeData {
  classes: TeacherClass[];
  tasks: TeacherTask[];
  /** Lessons students recently finished, newest first. */
  activity: RecentCompletion[];
  now: Date;
}

/** Everything on the teacher's home page comes from their real classes; nothing is sample data. */
export function createTeacherHomeLoader(dependencies: AppDependencies) {
  return async ({ request }: LoaderFunctionArgs): Promise<TeacherHomeData> => {
    await requireAccount(dependencies, request, 'teacher');
    const options = { signal: request.signal };
    const [classes, tasks, activity] = await Promise.all([
      dependencies.classes.listTeacherClasses(options),
      dependencies.tasks.listTeacherTasks(undefined, options),
      dependencies.reports.recentCompletions(options),
    ]);
    return { classes, tasks, activity, now: dependencies.now() };
  };
}

export function useTeacherHomeData(): TeacherHomeData {
  return useLoaderData<TeacherHomeData>();
}
