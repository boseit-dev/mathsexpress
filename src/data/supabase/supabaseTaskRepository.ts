import { AppError, type AppErrorCode } from '@/domain/errors';
import type { AnswerResult } from '@/domain/tasks';
import type { ProgressRepository, TaskRepository } from '../repositories';
import type { MathsExpressClient } from './client';
import { throwIfError, unwrap } from './errors';
import { toLearningItem, toStudentTask, toTaskStudentResult, toTeacherTask } from './mappers';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Ids come from addresses and forms, so a mistyped one is "not found" rather than a bad request. */
function checkId(id: string, notFound: AppErrorCode): string {
  if (!UUID_PATTERN.test(id)) throw new AppError(notFound);
  return id;
}

/** Tasks through the database functions, which check every permission on the server. */
export function createSupabaseTaskRepository(client: MathsExpressClient): TaskRepository {
  return {
    async listCatalogue({ signal } = {}) {
      const request = client.rpc('learning_catalogue');
      const rows = unwrap(await (signal ? request.abortSignal(signal) : request));
      return rows.map(toLearningItem);
    },

    async createTask(task) {
      return toTeacherTask(
        unwrap(
          await client.rpc('create_task', {
            class_id: checkId(task.classId, 'class_not_found'),
            title: task.title,
            content_id: task.contentId,
            due_at: task.dueAt,
            request_id: checkId(task.requestId, 'invalid_request'),
            instructions: task.instructions,
            ...(task.studentIds ? { student_ids: task.studentIds } : {}),
            publish: task.publish,
          }),
        ),
      );
    },

    async publishTask(taskId) {
      return toTeacherTask(
        unwrap(await client.rpc('publish_task', { task_id: checkId(taskId, 'task_not_found') })),
      );
    },

    async setDueDate(taskId, dueAt) {
      return toTeacherTask(
        unwrap(
          await client.rpc('set_task_due_date', {
            task_id: checkId(taskId, 'task_not_found'),
            due_at: dueAt,
          }),
        ),
      );
    },

    async deleteTask(taskId) {
      const { error } = await client.rpc('delete_task', {
        task_id: checkId(taskId, 'task_not_found'),
      });
      throwIfError(error);
    },

    async listTeacherTasks(classId, { signal } = {}) {
      const request = client.rpc(
        'teacher_tasks',
        classId ? { class_id: checkId(classId, 'class_not_found') } : {},
      );
      const rows = unwrap(await (signal ? request.abortSignal(signal) : request));
      return rows.map(toTeacherTask);
    },

    async getTask(taskId, { signal } = {}) {
      const request = client.rpc('get_task', { task_id: checkId(taskId, 'task_not_found') });
      return toTeacherTask(unwrap(await (signal ? request.abortSignal(signal) : request)));
    },

    async listTaskResults(taskId, { signal } = {}) {
      const request = client.rpc('task_results', { task_id: checkId(taskId, 'task_not_found') });
      const rows = unwrap(await (signal ? request.abortSignal(signal) : request));
      return rows.map(toTaskStudentResult);
    },

    async listMyTasks({ signal } = {}) {
      const request = client.rpc('my_tasks');
      const rows = unwrap(await (signal ? request.abortSignal(signal) : request));
      return rows.map(toStudentTask);
    },
  };
}

function decodeAnswer(value: unknown): AnswerResult {
  if (typeof value !== 'object' || value === null) throw new AppError('unknown');
  const raw = value as Record<string, unknown>;
  if (
    typeof raw.correct !== 'boolean' ||
    typeof raw.alreadySolved !== 'boolean' ||
    typeof raw.completed !== 'boolean'
  ) {
    throw new AppError('unknown');
  }
  return { correct: raw.correct, alreadySolved: raw.alreadySolved, completed: raw.completed };
}

/** Saved lesson progress; the server marks every answer. */
export function createSupabaseProgressRepository(client: MathsExpressClient): ProgressRepository {
  return {
    async startAttempt(contentId) {
      return unwrap(await client.rpc('start_lesson_attempt', { content_id: contentId }));
    },
    async recordAnswer(attemptId, questionId, answer, hintsUsed) {
      return decodeAnswer(
        unwrap(
          await client.rpc('record_answer', {
            attempt_id: checkId(attemptId, 'attempt_not_found'),
            question_id: questionId,
            answer,
            hints_used: hintsUsed,
          }),
        ),
      );
    },
  };
}
