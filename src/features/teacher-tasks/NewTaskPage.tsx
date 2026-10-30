import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Form, Link } from 'react-router';
import { useFormState } from '@/app/forms/useFormState';
import { ChoiceCards } from '@/components/forms/ChoiceCards';
import { FormMessage } from '@/components/forms/FormMessage';
import { SelectField } from '@/components/forms/SelectField';
import { SubmitButton } from '@/components/forms/SubmitButton';
import { TextAreaField } from '@/components/forms/TextAreaField';
import { TextField } from '@/components/forms/TextField';
import { PageHeader } from '@/components/ui/PageHeader';
import { paths } from '@/config/paths';
import { getFullName } from '@/domain/people';
import { formatYearLevel } from '@/domain/student';
import { TASK_INSTRUCTIONS_MAX, TASK_TITLE_MAX } from '@/domain/tasks';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatCount } from '@/lib/format';
import { useNewTaskData } from './teacherTaskHandlers';
import styles from './NewTaskPage.module.css';

/** yyyy-mm-dd for a date input, in local time. */
function dateInputValue(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Setting a task: which class, which lesson, when it is due and who it is for. */
export function NewTaskPage() {
  const { classes, students, catalogue, classId: chosenClass, now } = useNewTaskData();
  useDocumentTitle('Create a task');
  const form = useFormState();
  const [classId, setClassId] = useState(
    chosenClass ?? (classes.length === 1 ? (classes[0]?.id ?? '') : ''),
  );
  const [audience, setAudience] = useState<'class' | 'students'>('class');
  // One id per visit to this form: sending it twice (a double click, a retry) creates one task.
  const [requestId] = useState(() => crypto.randomUUID());
  const roster = students[classId] ?? [];
  const nextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
  const onlyLesson = catalogue.length === 1 ? catalogue[0] : undefined;

  return (
    <div className={styles.page}>
      <PageHeader
        title="Create a task"
        before={
          <Link to={paths.teacher.tasks} className={styles.back}>
            <ArrowLeft aria-hidden="true" />
            All tasks
          </Link>
        }
      >
        <p>Choose a lesson, set a due date and decide who it’s for.</p>
      </PageHeader>

      {classes.length === 0 ? (
        <p className={styles.note}>
          You need a class before you can set a task.{' '}
          <Link to={`${paths.teacher.classes}#create-class`}>Create a class</Link>.
        </p>
      ) : (
        <Form method="post" noValidate className={styles.form}>
          <FormMessage tone="error">{form.formMessage}</FormMessage>
          <input type="hidden" name="requestId" value={requestId} />

          <section className={styles.step} aria-labelledby="task-step-class">
            <h2 id="task-step-class" className={styles.stepTitle}>
              <span>1</span> Class
            </h2>
            <SelectField
              label="Class"
              name="classId"
              options={[
                { value: '', label: 'Choose a class' },
                ...classes.map((item) => ({
                  value: item.id,
                  label: `${item.name} · ${formatYearLevel(item.yearLevel)} · ${formatCount(item.studentCount, 'student')}`,
                })),
              ]}
              value={classId}
              onChange={(event) => {
                setClassId(event.target.value);
              }}
              error={form.fieldError('classId')}
            />
          </section>

          <section className={styles.step} aria-labelledby="task-step-content">
            <h2 id="task-step-content" className={styles.stepTitle}>
              <span>2</span> Lesson
            </h2>
            {catalogue.length === 0 ? (
              <p className={styles.note}>No lessons are published yet.</p>
            ) : (
              <ChoiceCards
                legend="Choose a lesson"
                name="contentId"
                defaultValue={onlyLesson?.id}
                choices={catalogue.map((item) => ({
                  value: item.id,
                  label: item.title,
                  description: `${formatYearLevel(item.yearLevel)} · ${item.strand} · ${formatCount(item.questionCount, 'question')} · about ${item.estimatedMinutes} min`,
                }))}
                error={form.fieldError('contentId')}
              />
            )}
            <p className={styles.hint}>
              Only finished lessons can be set. Practice sets, worksheets and tests will appear here
              when they are ready.
            </p>
          </section>

          <section className={styles.step} aria-labelledby="task-step-details">
            <h2 id="task-step-details" className={styles.stepTitle}>
              <span>3</span> Details
            </h2>
            <TextField
              label="Task title"
              name="title"
              hint="Students see this name on their home page."
              defaultValue={onlyLesson?.title ?? ''}
              maxLength={TASK_TITLE_MAX}
              autoComplete="off"
              required
              error={form.fieldError('title')}
            />
            <TextAreaField
              label="Instructions (optional)"
              name="instructions"
              hint={`Up to ${TASK_INSTRUCTIONS_MAX} characters.`}
              maxLength={TASK_INSTRUCTIONS_MAX}
              error={form.fieldError('instructions')}
            />
            <div className={styles.dueRow}>
              <TextField
                label="Due date"
                name="dueDate"
                type="date"
                defaultValue={dateInputValue(nextWeek)}
                min={dateInputValue(now)}
                required
                error={form.fieldError('dueDate')}
              />
              <TextField
                label="Due time"
                name="dueTime"
                type="time"
                defaultValue="23:59"
                required
              />
            </div>
          </section>

          <section className={styles.step} aria-labelledby="task-step-audience">
            <h2 id="task-step-audience" className={styles.stepTitle}>
              <span>4</span> Who it’s for
            </h2>
            <fieldset className={styles.audience}>
              <legend className={styles.visuallyHidden}>Who the task is for</legend>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="audience"
                  value="class"
                  checked={audience === 'class'}
                  onChange={() => {
                    setAudience('class');
                  }}
                />
                The whole class
                <span className={styles.radioHint}>Including students who join later.</span>
              </label>
              <label className={styles.radio}>
                <input
                  type="radio"
                  name="audience"
                  value="students"
                  checked={audience === 'students'}
                  onChange={() => {
                    setAudience('students');
                  }}
                />
                Chosen students
                <span className={styles.radioHint}>For extension or catch-up work.</span>
              </label>
            </fieldset>
            {audience === 'students' &&
              (classId === '' ? (
                <p className={styles.note}>Choose a class first.</p>
              ) : roster.length === 0 ? (
                <p className={styles.note}>No students have joined this class yet.</p>
              ) : (
                <fieldset
                  key={classId}
                  className={styles.students}
                  aria-describedby={
                    form.fieldError('studentIds') ? 'task-students-error' : undefined
                  }
                >
                  <legend className={styles.studentsLegend}>Students</legend>
                  {roster.map((student) => (
                    <label key={student.studentId} className={styles.check}>
                      <input type="checkbox" name="studentIds" value={student.studentId} />
                      {getFullName(student)}
                      <span className={styles.radioHint}>{formatYearLevel(student.yearLevel)}</span>
                    </label>
                  ))}
                  {form.fieldError('studentIds') && (
                    <p id="task-students-error" className={styles.error}>
                      {form.fieldError('studentIds')}
                    </p>
                  )}
                </fieldset>
              ))}
          </section>

          <div className={styles.actions}>
            <SubmitButton
              name="intent"
              value="publish"
              pending={form.isSubmitting('publish')}
              pendingLabel="Publishing…"
            >
              Publish task
            </SubmitButton>
            <SubmitButton
              variant="secondary"
              name="intent"
              value="draft"
              pending={form.isSubmitting('draft')}
              pendingLabel="Saving…"
            >
              Save as draft
            </SubmitButton>
          </div>
        </Form>
      )}
    </div>
  );
}
