// Loaders for teacher reports. Filters live in the address (?class=&period=&student=), so a
// report can be bookmarked or shared with a colleague who teaches the same class.
import { useLoaderData, type LoaderFunctionArgs } from 'react-router';
import { requireAccount } from '@/app/auth/guards';
import type { AppDependencies } from '@/data/repositories';
import type { TeacherClass } from '@/domain/classes';
import { AppError } from '@/domain/errors';
import {
  isReportPeriod,
  periodStart,
  type ReportPeriod,
  type StudentAttemptResult,
  type StudentProgressSummary,
  type TopicProgress,
} from '@/domain/reports';
import type { TeacherTask } from '@/domain/tasks';

export interface ClassReportData {
  classId: string;
  period: ReportPeriod;
  students: StudentProgressSummary[];
  topics: TopicProgress[];
  tasks: TeacherTask[];
  /** The chosen student and their attempts, when the report is about one student. */
  student: { summary: StudentProgressSummary; attempts: StudentAttemptResult[] } | null;
  now: Date;
}

export interface ReportsPageData {
  classes: TeacherClass[];
  report: ClassReportData | null;
}

async function loadClassReport(
  dependencies: AppDependencies,
  request: Request,
  classId: string,
): Promise<ClassReportData> {
  const params = new URL(request.url).searchParams;
  const requested = params.get('period');
  const period: ReportPeriod = isReportPeriod(requested) ? requested : '30d';
  const now = dependencies.now();
  const since = periodStart(period, now);
  const options = { signal: request.signal };
  const [students, topics, tasks] = await Promise.all([
    dependencies.reports.classProgress(classId, since, options),
    dependencies.reports.topicProgress(classId, since, options),
    dependencies.tasks.listTeacherTasks(classId, options),
  ]);
  const studentId = params.get('student');
  const summary = students.find((row) => row.studentId === studentId);
  const student = summary
    ? {
        summary,
        attempts: await dependencies.reports.studentResults(
          classId,
          summary.studentId,
          since,
          options,
        ),
      }
    : null;
  return { classId, period, students, topics, tasks, student, now };
}

function notFoundAs404(error: unknown): never {
  if (error instanceof AppError && error.code === 'class_not_found') {
    throw new Response('Not found', { status: 404 });
  }
  throw error;
}

export function createReportsLoader(dependencies: AppDependencies) {
  return async ({ request }: LoaderFunctionArgs): Promise<ReportsPageData> => {
    await requireAccount(dependencies, request, 'teacher');
    const classes = await dependencies.classes.listTeacherClasses({ signal: request.signal });
    const requested = new URL(request.url).searchParams.get('class');
    const chosen = classes.find((item) => item.id === requested) ?? classes[0];
    if (!chosen) return { classes, report: null };
    return { classes, report: await loadClassReport(dependencies, request, chosen.id) };
  };
}

export function useReportsData(): ReportsPageData {
  return useLoaderData<ReportsPageData>();
}

/** The Progress tab inside a class's workspace. */
export function createClassProgressLoader(dependencies: AppDependencies) {
  return async ({ request, params }: LoaderFunctionArgs): Promise<ClassReportData> => {
    await requireAccount(dependencies, request, 'teacher');
    try {
      return await loadClassReport(dependencies, request, params.classId ?? '');
    } catch (error) {
      notFoundAs404(error);
    }
  };
}

export function useClassProgressData(): ClassReportData {
  return useLoaderData<ClassReportData>();
}
