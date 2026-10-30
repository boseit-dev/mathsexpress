import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { requireAccount } from '@/app/auth/guards';
import type { AppDependencies } from '@/data/repositories';
import type { StudentTask } from '@/domain/tasks';

export interface LessonData {
  /** The student's open tasks for this lesson; a teacher setting it lets them open it. */
  tasks: StudentTask[];
  now: Date;
}

export function createLessonLoader(dependencies: AppDependencies) {
  return async ({ request, params }: LoaderFunctionArgs): Promise<LessonData> => {
    await requireAccount(dependencies, request, 'student');
    const tasks = await dependencies.tasks.listMyTasks({ signal: request.signal });
    return {
      tasks: tasks.filter((task) => task.contentId === params.lessonId),
      now: dependencies.now(),
    };
  };
}

export function useLessonData(): LessonData {
  return useLoaderData<LessonData>();
}
