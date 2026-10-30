import { AppError, type AppErrorCode } from '@/domain/errors';
import type { ReportRepository } from '../repositories';
import type { MathsExpressClient } from './client';
import { unwrap } from './errors';
import {
  toRecentCompletion,
  toStudentAttemptResult,
  toStudentProgressSummary,
  toTopicProgress,
} from './mappers';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function checkId(id: string, notFound: AppErrorCode): string {
  if (!UUID_PATTERN.test(id)) throw new AppError(notFound);
  return id;
}

function sinceArgument(since: Date | null) {
  return since ? { since: since.toISOString() } : {};
}

/** Reports through the database functions, which only report on the teacher's own classes. */
export function createSupabaseReportRepository(client: MathsExpressClient): ReportRepository {
  return {
    async classProgress(classId, since, { signal } = {}) {
      const request = client.rpc('class_progress', {
        class_id: checkId(classId, 'class_not_found'),
        ...sinceArgument(since),
      });
      const rows = unwrap(await (signal ? request.abortSignal(signal) : request));
      return rows.map(toStudentProgressSummary);
    },
    async studentResults(classId, studentId, since, { signal } = {}) {
      const request = client.rpc('student_results', {
        class_id: checkId(classId, 'class_not_found'),
        student_id: checkId(studentId, 'student_not_found'),
        ...sinceArgument(since),
      });
      const rows = unwrap(await (signal ? request.abortSignal(signal) : request));
      return rows.map(toStudentAttemptResult);
    },
    async topicProgress(classId, since, { signal } = {}) {
      const request = client.rpc('class_topic_progress', {
        class_id: checkId(classId, 'class_not_found'),
        ...sinceArgument(since),
      });
      const rows = unwrap(await (signal ? request.abortSignal(signal) : request));
      return rows.map(toTopicProgress);
    },
    async recentCompletions({ signal } = {}) {
      const request = client.rpc('recent_completions', { max_rows: 6 });
      const rows = unwrap(await (signal ? request.abortSignal(signal) : request));
      return rows.map(toRecentCompletion);
    },
  };
}
