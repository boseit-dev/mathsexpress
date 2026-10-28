// Loaders and actions for the teacher's class pages. Every change goes through a database
// function that checks the signed-in teacher owns the class, so these only tidy and validate
// the input before sending it.
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
import { formatJoinCode } from '@/domain/classes';
import { AppError } from '@/domain/errors';
import { getFullName } from '@/domain/people';
import { formatYearLevel, parseYearLevel } from '@/domain/student';
import { cleanText, validateClassName } from '@/domain/validation';

export function createTeacherClassesLoader(dependencies: AppDependencies) {
  return async ({ request }: LoaderFunctionArgs): Promise<TeacherClass[]> => {
    await requireAccount(dependencies, request, 'teacher');
    return dependencies.classes.listTeacherClasses({ signal: request.signal });
  };
}

export function useTeacherClassesData(): TeacherClass[] {
  return useLoaderData<TeacherClass[]>();
}

/** Creates a class, then opens it so the teacher can share its code. */
export function createTeacherClassesAction({ classes }: AppDependencies) {
  return ({ request }: ActionFunctionArgs) =>
    runForm(async () => {
      const form = await request.formData();
      const name = readText(form, 'name');
      if (validateClassName(name)) return formError('invalid_class_name', 'name');
      const yearLevel = parseYearLevel(readText(form, 'yearLevel'));
      if (yearLevel === null) return formError('invalid_year_level', 'yearLevel');
      const created = await classes.createClass(cleanText(name), yearLevel);
      throw redirect(paths.teacher.classDetail(created.id));
    });
}

export interface TeacherClassData {
  teacherClass: TeacherClass;
  students: ClassStudent[];
}

export function createTeacherClassLoader(dependencies: AppDependencies) {
  return async ({ request, params }: LoaderFunctionArgs): Promise<TeacherClassData> => {
    await requireAccount(dependencies, request, 'teacher');
    const classId = params.classId ?? '';
    const options = { signal: request.signal };
    try {
      const [teacherClass, students] = await Promise.all([
        dependencies.classes.getTeacherClass(classId, options),
        dependencies.classes.listClassStudents(classId, options),
      ]);
      return { teacherClass, students };
    } catch (error) {
      // Another teacher's class looks exactly like one that doesn't exist.
      if (error instanceof AppError && error.code === 'class_not_found') {
        throw new Response('Class not found', { status: 404 });
      }
      throw error;
    }
  };
}

export function useTeacherClassData(): TeacherClassData {
  return useLoaderData<TeacherClassData>();
}

async function saveSettings(
  { classes }: AppDependencies,
  classId: string,
  form: FormData,
): Promise<FormResult> {
  const name = readText(form, 'name');
  if (validateClassName(name)) return formError('invalid_class_name', 'name');
  const yearLevel = parseYearLevel(readText(form, 'yearLevel'));
  if (yearLevel === null) return formError('invalid_year_level', 'yearLevel');
  await classes.updateClass(classId, {
    name: cleanText(name),
    yearLevel,
    joiningEnabled: form.get('joiningEnabled') === 'on',
    studentsCanLeave: form.get('studentsCanLeave') === 'on',
  });
  return { ok: true, message: 'Class settings saved.' };
}

/** The changes a teacher can make on a class's page. */
export function createTeacherClassAction(dependencies: AppDependencies) {
  const { classes } = dependencies;
  return ({ request, params }: ActionFunctionArgs) =>
    runForm(async (): Promise<FormResult> => {
      const classId = params.classId ?? '';
      const form = await request.formData();
      const studentId = readText(form, 'studentId');

      switch (readText(form, 'intent')) {
        case 'settings':
          return saveSettings(dependencies, classId, form);
        case 'regenerate-code': {
          const code = await classes.regenerateJoinCode(classId);
          return {
            ok: true,
            message: `The new class code is ${formatJoinCode(code)}. The old code no longer works.`,
          };
        }
        case 'set-year-level': {
          const yearLevel = parseYearLevel(readText(form, 'yearLevel'));
          if (yearLevel === null) return formError('invalid_year_level', 'yearLevel');
          const student = await classes.setStudentYearLevel(classId, studentId, yearLevel);
          return {
            ok: true,
            message: `Saved. ${getFullName(student)} is in ${formatYearLevel(student.yearLevel)}.`,
          };
        }
        case 'remove-student':
          await classes.removeStudent(classId, studentId);
          return {
            ok: true,
            message: `${readText(form, 'studentName')} was removed from the class.`,
          };
        default:
          return formError('unknown');
      }
    });
}
