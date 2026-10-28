import type { ActionFunctionArgs } from 'react-router';
import { formError, readText, runForm, type FormResult } from '@/app/forms/formResult';
import type { AppDependencies } from '@/data/repositories';
import { AppError, type AppErrorCode } from '@/domain/errors';
import { validateJoinCode } from '@/domain/validation';

// Problems with the code the student typed, shown under the code field.
const JOIN_CODE_ERRORS = new Set<AppErrorCode>([
  'invalid_join_code',
  'join_code_not_found',
  'joining_closed',
  'already_member',
]);

/**
 * Joining and leaving classes. The database checks the code, whether the class is open, and
 * whether the teacher lets students leave; this action only checks the code's format first.
 */
export function createStudentClassAction({ classes }: AppDependencies) {
  return ({ request }: ActionFunctionArgs) =>
    runForm(async (): Promise<FormResult> => {
      const form = await request.formData();

      if (readText(form, 'intent') === 'leave') {
        await classes.leaveClass(readText(form, 'classId'));
        return { ok: true, message: `You left ${readText(form, 'className')}.` };
      }

      const code = readText(form, 'code');
      const codeProblem = validateJoinCode(code);
      if (codeProblem) return formError(codeProblem, 'code');
      try {
        const joined = await classes.joinClass(code);
        return {
          ok: true,
          message: `You joined ${joined.className}. Your teacher is ${joined.teacherName}.`,
        };
      } catch (error) {
        if (error instanceof AppError && JOIN_CODE_ERRORS.has(error.code)) {
          return formError(error.code, 'code');
        }
        throw error;
      }
    });
}
