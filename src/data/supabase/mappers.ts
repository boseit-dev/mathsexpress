// Converts database rows into domain objects. Composite results from Postgres are nullable by
// type, so every field is checked: a missing value is a server bug, reported loudly.
import type { Profile } from '@/domain/account';
import type { ClassStudent, StudentClassMembership, TeacherClass } from '@/domain/classes';
import type {
  RecentCompletion,
  StudentAttemptResult,
  StudentProgressSummary,
  TopicProgress,
} from '@/domain/reports';
import { AppError } from '@/domain/errors';
import { yearLevelFromNumber } from '@/domain/student';
import type {
  ContentKind,
  LearningItem,
  StudentTask,
  TaskAudience,
  TaskState,
  TaskStudentResult,
  TeacherTask,
} from '@/domain/tasks';
import type { Database } from './database.types';

type Composite = Database['public']['CompositeTypes'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];

function required<T>(value: T | null | undefined, field: string): T {
  if (value === null || value === undefined) {
    throw new AppError('unknown', { cause: new Error(`The server response is missing ${field}`) });
  }
  return value;
}

export function toProfile(row: ProfileRow): Profile {
  return { id: row.id, role: row.role, firstName: row.first_name, lastName: row.last_name };
}

export function toTeacherClass(row: Composite['teacher_class']): TeacherClass {
  return {
    id: required(row.id, 'id'),
    name: required(row.name, 'name'),
    yearLevel: yearLevelFromNumber(required(row.year_level, 'year_level')),
    joinCode: required(row.join_code, 'join_code'),
    joiningEnabled: required(row.joining_enabled, 'joining_enabled'),
    studentsCanLeave: required(row.students_can_leave, 'students_can_leave'),
    studentCount: required(row.student_count, 'student_count'),
    createdAt: required(row.created_at, 'created_at'),
  };
}

export function toStudentClass(row: Composite['student_class']): StudentClassMembership {
  return {
    classId: required(row.class_id, 'class_id'),
    className: required(row.class_name, 'class_name'),
    classYearLevel: yearLevelFromNumber(required(row.class_year_level, 'class_year_level')),
    yearLevel: yearLevelFromNumber(required(row.my_year_level, 'my_year_level')),
    // Optional, so one class without a teacher can never stop a student's pages loading.
    teacherName: row.teacher_name,
    studentsCanLeave: required(row.students_can_leave, 'students_can_leave'),
    joinedAt: required(row.joined_at, 'joined_at'),
  };
}

export function toClassStudent(row: Composite['class_student']): ClassStudent {
  return {
    studentId: required(row.student_id, 'student_id'),
    firstName: required(row.first_name, 'first_name'),
    lastName: required(row.last_name, 'last_name'),
    yearLevel: yearLevelFromNumber(required(row.year_level, 'year_level')),
    joinedAt: required(row.joined_at, 'joined_at'),
  };
}

function contentKind(value: string | null): ContentKind {
  const kind = required(value, 'kind');
  if (kind === 'lesson' || kind === 'practice' || kind === 'worksheet' || kind === 'test') {
    return kind;
  }
  throw new AppError('unknown', { cause: new Error(`Unknown content kind ${kind}`) });
}

function taskState(value: string | null): TaskState {
  const state = required(value, 'status');
  if (state === 'draft' || state === 'published') return state;
  throw new AppError('unknown', { cause: new Error(`Unknown task status ${state}`) });
}

function taskAudience(value: string | null): TaskAudience {
  const audience = required(value, 'assign_to');
  if (audience === 'class' || audience === 'students') return audience;
  throw new AppError('unknown', { cause: new Error(`Unknown task audience ${audience}`) });
}

export function toLearningItem(row: Composite['learning_item']): LearningItem {
  return {
    id: required(row.id, 'id'),
    kind: contentKind(row.kind),
    title: required(row.title, 'title'),
    strand: required(row.strand, 'strand'),
    topic: required(row.topic, 'topic'),
    yearLevel: yearLevelFromNumber(required(row.year_level, 'year_level')),
    questionCount: required(row.question_count, 'question_count'),
    estimatedMinutes: required(row.estimated_minutes, 'estimated_minutes'),
  };
}

export function toTeacherTask(row: Composite['teacher_task']): TeacherTask {
  return {
    id: required(row.id, 'id'),
    classId: required(row.class_id, 'class_id'),
    className: required(row.class_name, 'class_name'),
    title: required(row.title, 'title'),
    instructions: row.instructions,
    contentId: required(row.content_id, 'content_id'),
    contentTitle: required(row.content_title, 'content_title'),
    contentKind: contentKind(row.content_kind),
    state: taskState(row.status),
    audience: taskAudience(row.assign_to),
    dueAt: required(row.due_at, 'due_at'),
    createdAt: required(row.created_at, 'created_at'),
    publishedAt: row.published_at,
    assignedCount: required(row.assigned_count, 'assigned_count'),
    completedCount: required(row.completed_count, 'completed_count'),
    inProgressCount: required(row.in_progress_count, 'in_progress_count'),
  };
}

export function toTaskStudentResult(row: Composite['task_student_result']): TaskStudentResult {
  return {
    studentId: required(row.student_id, 'student_id'),
    firstName: required(row.first_name, 'first_name'),
    lastName: required(row.last_name, 'last_name'),
    progress: required(row.status, 'status'),
    completedAt: row.completed_at,
    lastActivityAt: row.last_activity_at,
    questionsSolved: required(row.questions_solved, 'questions_solved'),
    firstTryCorrect: required(row.first_try_correct, 'first_try_correct'),
    questionCount: required(row.question_count, 'question_count'),
  };
}

export function toStudentTask(row: Composite['student_task']): StudentTask {
  return {
    id: required(row.id, 'id'),
    classId: required(row.class_id, 'class_id'),
    className: required(row.class_name, 'class_name'),
    title: required(row.title, 'title'),
    instructions: row.instructions,
    contentId: required(row.content_id, 'content_id'),
    contentTitle: required(row.content_title, 'content_title'),
    contentKind: contentKind(row.content_kind),
    topic: required(row.topic, 'topic'),
    questionCount: required(row.question_count, 'question_count'),
    estimatedMinutes: required(row.estimated_minutes, 'estimated_minutes'),
    dueAt: required(row.due_at, 'due_at'),
    publishedAt: required(row.published_at, 'published_at'),
    progress: required(row.status, 'status'),
    completedAt: row.completed_at,
    questionsSolved: required(row.questions_solved, 'questions_solved'),
  };
}

export function toStudentProgressSummary(
  row: Composite['student_progress_summary'],
): StudentProgressSummary {
  return {
    studentId: required(row.student_id, 'student_id'),
    firstName: required(row.first_name, 'first_name'),
    lastName: required(row.last_name, 'last_name'),
    yearLevel: yearLevelFromNumber(required(row.year_level, 'year_level')),
    lessonsCompleted: required(row.lessons_completed, 'lessons_completed'),
    questionsAnswered: required(row.questions_answered, 'questions_answered'),
    firstTryCorrect: required(row.first_try_correct, 'first_try_correct'),
    hintsUsed: required(row.hints_used, 'hints_used'),
    tasksAssigned: required(row.tasks_assigned, 'tasks_assigned'),
    tasksCompleted: required(row.tasks_completed, 'tasks_completed'),
    lastActiveAt: row.last_active_at,
  };
}

export function toStudentAttemptResult(
  row: Composite['student_attempt_result'],
): StudentAttemptResult {
  return {
    attemptId: required(row.attempt_id, 'attempt_id'),
    contentId: required(row.content_id, 'content_id'),
    contentTitle: required(row.content_title, 'content_title'),
    strand: required(row.strand, 'strand'),
    topic: required(row.topic, 'topic'),
    startedAt: required(row.started_at, 'started_at'),
    lastActivityAt: required(row.last_activity_at, 'last_activity_at'),
    completedAt: row.completed_at,
    questionCount: required(row.question_count, 'question_count'),
    questionsAnswered: required(row.questions_answered, 'questions_answered'),
    firstTryCorrect: required(row.first_try_correct, 'first_try_correct'),
    hintsUsed: required(row.hints_used, 'hints_used'),
  };
}

export function toTopicProgress(row: Composite['topic_progress']): TopicProgress {
  return {
    contentId: required(row.content_id, 'content_id'),
    contentTitle: required(row.content_title, 'content_title'),
    strand: required(row.strand, 'strand'),
    topic: required(row.topic, 'topic'),
    classSize: required(row.class_size, 'class_size'),
    studentsStarted: required(row.students_started, 'students_started'),
    studentsCompleted: required(row.students_completed, 'students_completed'),
    questionsAnswered: required(row.questions_answered, 'questions_answered'),
    firstTryCorrect: required(row.first_try_correct, 'first_try_correct'),
  };
}

export function toRecentCompletion(row: Composite['recent_completion']): RecentCompletion {
  return {
    studentId: required(row.student_id, 'student_id'),
    firstName: required(row.first_name, 'first_name'),
    lastName: required(row.last_name, 'last_name'),
    classId: required(row.class_id, 'class_id'),
    className: required(row.class_name, 'class_name'),
    contentTitle: required(row.content_title, 'content_title'),
    completedAt: required(row.completed_at, 'completed_at'),
    questionCount: required(row.question_count, 'question_count'),
    firstTryCorrect: required(row.first_try_correct, 'first_try_correct'),
  };
}
