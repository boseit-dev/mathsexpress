import { cleanText } from '@/domain/validation';
import type { AccountRepository } from '../repositories';
import type { MathsExpressClient } from './client';
import { throwIfError, unwrap } from './errors';
import { toProfile } from './mappers';

export function createSupabaseAccountRepository(client: MathsExpressClient): AccountRepository {
  return {
    async getMyProfile({ signal } = {}) {
      const { data: auth } = await client.auth.getUser();
      if (!auth.user) return null;
      let query = client.from('profiles').select('*').eq('id', auth.user.id);
      if (signal) query = query.abortSignal(signal);
      const { data, error } = await query.maybeSingle();
      throwIfError(error);
      return data ? toProfile(data) : null;
    },

    async completeProfile({ role, firstName, lastName }) {
      const row = unwrap(
        await client.rpc('complete_profile', {
          role,
          first_name: cleanText(firstName),
          last_name: cleanText(lastName),
        }),
      );
      return toProfile(row);
    },
  };
}
