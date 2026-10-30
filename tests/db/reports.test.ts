import { randomUUID } from 'node:crypto';
import { describe, expect, it } from 'vitest';
import { createClass, createStudent, createTeacher, type TestUser } from './helpers.ts';

const LESSON = 'linear-equations-basics';
const ANSWERS: [string, string][] = [
  ['eq-1', '5'],
  ['eq-2', '5'],
  ['eq-3', '-3'],
  ['eq-4', '5'],
  ['eq-5', '-4'],
];

async function join(student: TestUser, code: string) {
  const { error } = await student.client.rpc('join_class', { code });
  if (error) throw error;
}

/** Answers the lesson: wrong once on the first question, then everything right. */
async function finishLesson(student: TestUser) {
  const { data: attempt } = await student.client.rpc('start_lesson_attempt', {
    content_id: LESSON,
  });
  const attemptId = attempt ?? '';
  await student.client.rpc('record_answer', {
    attempt_id: attemptId,
    question_id: 'eq-1',
    answer: '1',
  });
  for (const [question, answer] of ANSWERS) {
    await student.client.rpc('record_answer', {
      attempt_id: attemptId,
      question_id: question,
      answer,
      hints_used: question === 'eq-2' ? 1 : 0,
    });
  }
}

async function classroom() {
  const teacher = await createTeacher();
  const created = await createClass(teacher, 'Reports class', 9);
  const mia = await createStudent('Mia', 'Chen');
  const leo = await createStudent('Leo', 'Zhang');
  await join(mia, created.join_code);
  await join(leo, created.join_code);
  return { teacher, classId: created.id, mia, leo };
}

describe('teacher reports', () => {
  it('summarises each student from saved, server-marked answers only', async () => {
    const { teacher, classId, mia, leo } = await classroom();
    await teacher.client.rpc('create_task', {
      class_id: classId,
      title: 'Homework',
      content_id: LESSON,
      due_at: new Date(Date.now() + 86_400_000).toISOString(),
      request_id: randomUUID(),
    });
    await finishLesson(mia);

    const { data, error } = await teacher.client.rpc('class_progress', { class_id: classId });
    expect(error).toBeNull();
    const miaRow = data?.find((row) => row.student_id === mia.id);
    const leoRow = data?.find((row) => row.student_id === leo.id);
    expect(miaRow).toMatchObject({
      lessons_completed: 1,
      questions_answered: 5,
      first_try_correct: 4,
      hints_used: 1,
      tasks_assigned: 1,
      tasks_completed: 1,
    });
    // No activity is shown as none, never as a made-up score.
    expect(leoRow).toMatchObject({
      lessons_completed: 0,
      questions_answered: 0,
      tasks_completed: 0,
      last_active_at: null,
    });

    const topics = await teacher.client.rpc('class_topic_progress', { class_id: classId });
    expect(topics.data).toEqual([
      expect.objectContaining({
        content_id: LESSON,
        class_size: 2,
        students_started: 1,
        students_completed: 1,
      }),
    ]);

    const results = await teacher.client.rpc('student_results', {
      class_id: classId,
      student_id: mia.id,
    });
    expect(results.data).toEqual([
      expect.objectContaining({ questions_answered: 5, first_try_correct: 4, hints_used: 1 }),
    ]);
  });

  it('filters by period', async () => {
    const { teacher, classId, mia } = await classroom();
    await finishLesson(mia);
    const future = new Date(Date.now() + 3_600_000).toISOString();
    const { data } = await teacher.client.rpc('class_progress', {
      class_id: classId,
      since: future,
    });
    expect(data?.find((row) => row.student_id === mia.id)?.questions_answered).toBe(0);
  });

  it('keeps other teachers, students and former students out', async () => {
    const { teacher, classId, mia } = await classroom();
    await finishLesson(mia);
    const other = await createTeacher();
    expect((await other.client.rpc('class_progress', { class_id: classId })).error?.message).toBe(
      'class_not_found',
    );
    expect(
      (await other.client.rpc('student_results', { class_id: classId, student_id: mia.id })).error
        ?.message,
    ).toBe('class_not_found');
    expect((await other.client.rpc('recent_completions')).data).toEqual([]);
    expect((await mia.client.rpc('class_progress', { class_id: classId })).error?.message).toBe(
      'teachers_only',
    );

    const recent = await teacher.client.rpc('recent_completions');
    expect(recent.data?.map((row) => row.student_id)).toContain(mia.id);

    await teacher.client.rpc('remove_student', { class_id: classId, student_id: mia.id });
    expect(
      (await teacher.client.rpc('student_results', { class_id: classId, student_id: mia.id })).error
        ?.message,
    ).toBe('student_not_found');
    const after = await teacher.client.rpc('recent_completions');
    expect(after.data?.map((row) => row.student_id)).not.toContain(mia.id);
  });
});
