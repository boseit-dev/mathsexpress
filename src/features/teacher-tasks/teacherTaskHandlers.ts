// Loaders and actions for the teacher's Tasks pages. The database functions check every
// permission; these tidy and validate input first, so mistakes are explained beside the field.
import {
  redirect,
  useLoaderData,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from 'react-router';
import { requireAccount } from '@/app/auth/guards';
import { formError, readText, runForm, type FormResult } from '@/app/forms/formResult';
import { paths } from '@/config/paths';
import type { AppDependencies } from '@/data/repositories';
import type { ClassStudent, TeacherClass } from '@/domain/classes';
import { AppError } from '@/domain/errors';
import {
  ASSIGNABLE_KINDS,
  TASK_INSTRUCTIONS_MAX,
  TASK_TITLE_MAX,
  type LearningItem,
  type TaskStudentResult,
  type TeacherTask,
} from '@/domain/tasks';
import { cleanText } from '@/domain/validation';

/** Treats another teacher's task or class exactly like one that doesn't exist. */
function notFoundAs404(error: unknown): never {
  if (
    error instanceof AppError &&
    (error.code === 'task_not_found' || error.code === 'class_not_found')
  ) {
    throw new Response('Not found', { status: 404 });
  }
  throw error;
}

// --- All tasks ---------------------------------------------------------------------------------

export interface TeacherTasksData {
  tasks: TeacherTask[];
  classes: TeacherClass[];
  now: Date;
}

export function createTeacherTasksLoader(dependencies: AppDependencies) {
  return async ({ request }: LoaderFunctionArgs): Promise<TeacherTasksData> => {
    await requireAccount(dependencies, request, 'teacher');
    const options = { signal: request.signal };
    const [tasks, classes] = await Promise.all([
      dependencies.tasks.listTeacherTasks(undefined, options),
      dependencies.classes.listTeacherClasses(options),
    ]);
    return { tasks, classes, now: dependencies.now() };
  };
}

export function useTeacherTasksData(): TeacherTasksData {
  return useLoaderData<TeacherTasksData>();
}

// --- One class's tasks -------------------------------------------------------------------------

export interface ClassTasksData {
  tasks: TeacherTask[];
  now: Date;
}

export function createClassTasksLoader(dependencies: AppDependencies) {
  return async ({ request, params }: LoaderFunctionArgs): Promise<ClassTasksData> => {
    await requireAccount(dependencies, request, 'teacher');
    try {
      const tasks = await dependencies.tasks.listTeacherTasks(params.classId ?? '', {
        signal: request.signal,
      });
      return { tasks, now: dependencies.now() };
    } catch (error) {
      notFoundAs404(error);
    }
  };
}

export function useClassTasksData(): ClassTasksData {
  return useLoaderData<ClassTasksData>();
}

// --- Setting a task ----------------------------------------------------------------------------

export interface NewTaskData {
  classes: TeacherClass[];
  /** Each class's students, for choosing who the task is for. */
  students: Record<string, ClassStudent[]>;
  catalogue: LearningItem[];
  /** The class chosen in the address (?class=), if the teacher came from a class. */
  classId: string | null;
  now: Date;
}

export function createNewTaskLoader(dependencies: AppDependencies) {
  return async ({ request }: LoaderFunctionArgs): Promise<NewTaskData> => {
    await requireAccount(dependencies, request, 'teacher');
    const options = { signal: request.signal };
    const [classes, catalogue] = await Promise.all([
      dependencies.classes.listTeacherClasses(options),
      dependencies.tasks.listCatalogue(options),
    ]);
    const rosters = await Promise.all(
      classes.map((item) => dependencies.classes.listClassStudents(item.id, options)),
    );
    const requested = new URL(request.url).searchParams.get('class');
    return {
      classes,
      students: Object.fromEntries(classes.map((item, i) => [item.id, rosters[i] ?? []])),
      catalogue: catalogue.filter((item) => ASSIGNABLE_KINDS.includes(item.kind)),
      classId: classes.some((item) => item.id === requested) ? requested : null,
      now: dependencies.now(),
    };
  };
}

export function useNewTaskData(): NewTaskData {
  return useLoaderData<NewTaskData>();
}

/** Reads the date and time inputs as a moment in the teacher's own time zone. */
export function readDueAt(form: FormData): Date | null {
  const date = readText(form, 'dueDate');
  const time = readText(form, 'dueTime') || '23:59';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return null;
  const due = new Date(`${date}T${time}`);
  return Number.isNaN(due.getTime()) ? null : due;
}

export function createNewTaskAction(dependencies: AppDependencies) {
  return ({ request }: ActionFunctionArgs) =>
    runForm(async (): Promise<FormResult> => {
      const form = await request.formData();
      const classId = readText(form, 'classId');
      if (!classId) return formError('class_not_found', 'classId');
      const contentId = readText(form, 'contentId');
      if (!contentId) return formError('content_unavailable', 'contentId');
      const title = cleanText(readText(form, 'title'));
      if (!title || title.length > TASK_TITLE_MAX) return formError('invalid_task_title', 'title');
      const instructions = readText(form, 'instructions').trim();
      if (instructions.length > TASK_INSTRUCTIONS_MAX) {
        return formError('invalid_instructions', 'instructions');
      }
      const dueAt = readDueAt(form);
      if (!dueAt || dueAt <= dependencies.now()) return formError('invalid_due_date', 'dueDate');
      const audience = readText(form, 'audience');
      const studentIds = audience === 'students' ? form.getAll('studentIds').map(String) : null;
      if (studentIds?.length === 0) return formError('invalid_students', 'studentIds');

      const created = await dependencies.tasks.createTask({
        classId,
        title,
        instructions,
        contentId,
        dueAt: dueAt.toISOString(),
        studentIds,
        publish: readText(form, 'intent') !== 'draft',
        requestId: readText(form, 'requestId'),
      });
      throw redirect(paths.teacher.taskDetail(created.id));
    });
}

// --- One task ----------------------------------------------------------------------------------

export interface TaskDetailData {
  task: TeacherTask;
  results: TaskStudentResult[];
  now: Date;
}

export function createTaskDetailLoader(dependencies: AppDependencies) {
  return async ({ request, params }: LoaderFunctionArgs): Promise<TaskDetailData> => {
    await requireAccount(dependencies, request, 'teacher');
    const taskId = params.taskId ?? '';
    const options = { signal: request.signal };
    try {
      const [task, results] = await Promise.all([
        dependencies.tasks.getTask(taskId, options),
        dependencies.tasks.listTaskResults(taskId, options),
      ]);
      return { task, results, now: dependencies.now() };
    } catch (error) {
      notFoundAs404(error);
    }
  };
}

export function useTaskDetailData(): TaskDetailData {
  return useLoaderData<TaskDetailData>();
}

export function createTaskDetailAction(dependencies: AppDependencies) {
  const { tasks } = dependencies;
  return ({ request, params }: ActionFunctionArgs) =>
    runForm(async (): Promise<FormResult> => {
      const taskId = params.taskId ?? '';
      const form = await request.formData();
      switch (readText(form, 'intent')) {
        case 'publish':
          await tasks.publishTask(taskId);
          return { ok: true, message: 'Published. Students can see this task now.' };
        case 'due-date': {
          const dueAt = readDueAt(form);
          if (!dueAt || dueAt <= dependencies.now()) {
            return formError('invalid_due_date', 'dueDate');
          }
          await tasks.setDueDate(taskId, dueAt.toISOString());
          return { ok: true, message: 'Due date saved.' };
        }
        case 'delete':
          await tasks.deleteTask(taskId);
          throw redirect(paths.teacher.tasks);
        default:
          return formError('unknown');
      }
    });
}
