import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { admin, createClass, createStudent, createTeacher, type TestUser } from './helpers.ts';

const LESSON = 'linear-equations-basics';
/** The lesson's answers, as published in src/domain/learning.ts. */
const ANSWERS = { 'eq-1': '5', 'eq-2': '5', 'eq-3': '-3', 'eq-4': '5', 'eq-5': '-4' };

function inDays(days: number): string {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

async function join(student: TestUser, code: string) {
  const { error } = await student.client.rpc('join_class', { code });
  if (error) throw error;
}

/** A Year 9 class with a teacher and two students in it. */
async function classroom() {
  const teacher = await createTeacher();
  const created = await createClass(teacher, 'Tasks class', 9);
  const mia = await createStudent('Mia', 'Chen');
  const leo = await createStudent('Leo', 'Zhang');
  await join(mia, created.join_code);
  await join(leo, created.join_code);
  return { teacher, classId: created.id, mia, leo };
}

async function createTask(
  teacher: TestUser,
  classId: string,
  extra: Partial<{
    title: string;
    content_id: string;
    due_at: string;
    student_ids: string[];
    publish: boolean;
    request_id: string;
  }> = {},
) {
  return teacher.client.rpc('create_task', {
    class_id: classId,
    title: 'Linear equations homework',
    content_id: LESSON,
    due_at: inDays(7),
    request_id: randomUUID(),
    ...extra,
  });
}

async function myTaskIds(student: TestUser): Promise<(string | null)[]> {
  const { data, error } = await student.client.rpc('my_tasks');
  if (error) throw error;
  return data.map((task) => task.id);
}

describe('learning catalogue', () => {
  it('stores the published lesson and its answers for server marking', async () => {
    const { data } = await admin
      .from('learning_questions')
      .select('question_id, answer')
      .eq('content_id', LESSON)
      .order('position');
    expect(data?.map((row) => [row.question_id, String(row.answer)])).toEqual(
      Object.entries(ANSWERS),
    );
    const student = await createStudent();
    const { data: catalogue } = await student.client.rpc('learning_catalogue');
    expect(catalogue?.map((item) => item.id)).toContain(LESSON);
  });

  it('never lets the app read answers directly', async () => {
    const student = await createStudent();
    const { data, error } = await student.client.from('learning_questions').select('*');
    expect(error ?? data).toBeTruthy();
    expect(data ?? []).toEqual([]);
  });
});

describe('teacher tasks', () => {
  it('assigns a published task to the whole class, and only its students see it', async () => {
    const { teacher, classId, mia, leo } = await classroom();
    const outsider = await createStudent();
    const { data: task, error } = await createTask(teacher, classId);
    expect(error).toBeNull();
    expect(task).toMatchObject({ status: 'published', assign_to: 'class', assigned_count: 2 });
    expect(await myTaskIds(mia)).toContain(task?.id);
    expect(await myTaskIds(leo)).toContain(task?.id);
    expect(await myTaskIds(outsider)).not.toContain(task?.id);
  });

  it('creates a task only once when the same form is sent twice', async () => {
    const { teacher, classId } = await classroom();
    const request = randomUUID();
    const first = await createTask(teacher, classId, { request_id: request });
    const second = await createTask(teacher, classId, { request_id: request });
    expect(second.data?.id).toBe(first.data?.id);
    const { data } = await teacher.client.rpc('teacher_tasks', { class_id: classId });
    expect(data).toHaveLength(1);
  });

  it('checks the title, content, due date and chosen students on the server', async () => {
    const { teacher, classId } = await classroom();
    const outsider = await createStudent();
    expect((await createTask(teacher, classId, { title: '   ' })).error?.message).toBe(
      'invalid_task_title',
    );
    expect((await createTask(teacher, classId, { content_id: 'no-such' })).error?.message).toBe(
      'content_unavailable',
    );
    expect((await createTask(teacher, classId, { due_at: inDays(-1) })).error?.message).toBe(
      'invalid_due_date',
    );
    expect(
      (await createTask(teacher, classId, { student_ids: [outsider.id] })).error?.message,
    ).toBe('invalid_students');
    expect((await createTask(teacher, classId, { student_ids: [] })).error?.message).toBe(
      'invalid_students',
    );
  });

  it('sets work for chosen students only', async () => {
    const { teacher, classId, mia, leo } = await classroom();
    const { data: task } = await createTask(teacher, classId, { student_ids: [mia.id] });
    expect(task).toMatchObject({ assign_to: 'students', assigned_count: 1 });
    expect(await myTaskIds(mia)).toContain(task?.id);
    expect(await myTaskIds(leo)).not.toContain(task?.id);
  });

  it('keeps drafts from students until they are published', async () => {
    const { teacher, classId, mia } = await classroom();
    const { data: draft } = await createTask(teacher, classId, { publish: false });
    expect(draft?.status).toBe('draft');
    expect(await myTaskIds(mia)).not.toContain(draft?.id);
    const published = await teacher.client.rpc('publish_task', { task_id: draft?.id ?? '' });
    expect(published.data?.status).toBe('published');
    expect(await myTaskIds(mia)).toContain(draft?.id);
    const again = await teacher.client.rpc('publish_task', { task_id: draft?.id ?? '' });
    expect(again.error?.message).toBe('task_already_published');
  });

  it('keeps other teachers and students out', async () => {
    const { teacher, classId, mia } = await classroom();
    const other = await createTeacher();
    const { data: task } = await createTask(teacher, classId);
    const taskId = task?.id ?? '';
    expect((await createTask(other, classId)).error?.message).toBe('class_not_found');
    expect((await other.client.rpc('get_task', { task_id: taskId })).error?.message).toBe(
      'task_not_found',
    );
    expect((await other.client.rpc('task_results', { task_id: taskId })).error?.message).toBe(
      'task_not_found',
    );
    expect((await other.client.rpc('delete_task', { task_id: taskId })).error?.message).toBe(
      'task_not_found',
    );
    const otherTasks = await other.client.rpc('teacher_tasks');
    expect(otherTasks.data?.map((item) => item.id)).not.toContain(taskId);
    expect((await createTask(mia, classId)).error?.message).toBe('teachers_only');
    expect((await mia.client.rpc('task_results', { task_id: taskId })).error?.message).toBe(
      'teachers_only',
    );
  });

  it('moves due dates and deletes tasks', async () => {
    const { teacher, classId, mia } = await classroom();
    const { data: task } = await createTask(teacher, classId);
    const taskId = task?.id ?? '';
    const later = inDays(14);
    const moved = await teacher.client.rpc('set_task_due_date', { task_id: taskId, due_at: later });
    expect(new Date(moved.data?.due_at ?? '').toISOString()).toBe(later);
    const past = await teacher.client.rpc('set_task_due_date', {
      task_id: taskId,
      due_at: inDays(-2),
    });
    expect(past.error?.message).toBe('invalid_due_date');
    expect((await teacher.client.rpc('delete_task', { task_id: taskId })).error).toBeNull();
    expect(await myTaskIds(mia)).not.toContain(taskId);
  });
});

describe('saved lesson progress', () => {
  it('marks answers on the server and completes the task only when every answer is right', async () => {
    const { teacher, classId, mia } = await classroom();
    const { data: task } = await createTask(teacher, classId);
    const taskId = task?.id ?? '';
    const { data: attempt, error } = await mia.client.rpc('start_lesson_attempt', {
      content_id: LESSON,
    });
    expect(error).toBeNull();
    const attemptId = attempt ?? '';

    const wrong = await mia.client.rpc('record_answer', {
      attempt_id: attemptId,
      question_id: 'eq-1',
      answer: '4',
    });
    expect(wrong.data).toMatchObject({ correct: false, completed: false });
    const [inProgress] = (await mia.client.rpc('my_tasks')).data ?? [];
    expect(inProgress?.status).toBe('in_progress');

    for (const [question, answer] of Object.entries(ANSWERS)) {
      await mia.client.rpc('record_answer', {
        attempt_id: attemptId,
        question_id: question,
        answer,
        hints_used: question === 'eq-1' ? 1 : 0,
      });
    }
    const [done] = (await mia.client.rpc('my_tasks')).data ?? [];
    expect(done).toMatchObject({ status: 'completed', questions_solved: 5 });

    const { data: results } = await teacher.client.rpc('task_results', { task_id: taskId });
    const miaResult = results?.find((row) => row.student_id === mia.id);
    // Four questions right first time; the first needed a second try.
    expect(miaResult).toMatchObject({ status: 'completed', first_try_correct: 4 });
    const summary = await teacher.client.rpc('get_task', { task_id: taskId });
    expect(summary.data).toMatchObject({ completed_count: 1, assigned_count: 2 });
  });

  it('ignores answers resent for a solved question, and other students’ attempts', async () => {
    const { mia, leo } = await classroom();
    const { data: attempt } = await mia.client.rpc('start_lesson_attempt', { content_id: LESSON });
    const attemptId = attempt ?? '';
    await mia.client.rpc('record_answer', {
      attempt_id: attemptId,
      question_id: 'eq-1',
      answer: '5',
    });
    const resent = await mia.client.rpc('record_answer', {
      attempt_id: attemptId,
      question_id: 'eq-1',
      answer: '9',
    });
    expect(resent.data).toMatchObject({ alreadySolved: true });
    const { data: rows } = await admin
      .from('attempt_questions')
      .select('tries, first_try_correct')
      .eq('attempt_id', attemptId);
    expect(rows).toEqual([{ tries: 1, first_try_correct: true }]);

    const stolen = await leo.client.rpc('record_answer', {
      attempt_id: attemptId,
      question_id: 'eq-2',
      answer: '5',
    });
    expect(stolen.error?.message).toBe('attempt_not_found');
    const nonsense = await mia.client.rpc('record_answer', {
      attempt_id: attemptId,
      question_id: 'eq-2',
      answer: 'five',
    });
    expect(nonsense.error?.message).toBe('invalid_answer');
  });

  it('opens lessons for a student’s year level, or when a teacher assigns them', async () => {
    const teacher = await createTeacher();
    const year7 = await createClass(teacher, 'Year 7 class', 7);
    const student = await createStudent();
    await join(student, year7.join_code);
    const closed = await student.client.rpc('start_lesson_attempt', { content_id: LESSON });
    expect(closed.error?.message).toBe('content_unavailable');

    await createTask(teacher, year7.id);
    const open = await student.client.rpc('start_lesson_attempt', { content_id: LESSON });
    expect(open.error).toBeNull();
  });
});
