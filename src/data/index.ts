import type { SupabaseConfig } from '@/config/env';
import type { AppDependencies } from './repositories';
import { createSampleStudentHomeRepository } from './sample/sampleStudentHomeRepository';
import { createSupabaseClient } from './supabase/client';
import { createSupabaseAccountRepository } from './supabase/supabaseAccountRepository';
import { createSupabaseAuthService } from './supabase/supabaseAuthService';
import { createSupabaseClassRepository } from './supabase/supabaseClassRepository';
import { createSupabaseShopRepository } from './supabase/supabaseShopRepository';

interface DependencyOptions {
  /** Where the app is served, so sign-in providers can send people back to it. */
  appOrigin: string;
  now?: () => Date;
}

/**
 * Builds the app's data sources: real accounts and classes from Supabase, and development sample
 * data for the parts of the home page that later phases will build.
 */
export function createAppDependencies(
  config: SupabaseConfig,
  { appOrigin, now = () => new Date() }: DependencyOptions,
): AppDependencies {
  const client = createSupabaseClient(config);
  return {
    auth: createSupabaseAuthService(client, config, { appOrigin }),
    accounts: createSupabaseAccountRepository(client),
    classes: createSupabaseClassRepository(client),
    studentHome: createSampleStudentHomeRepository(now),
    shop: createSupabaseShopRepository(client),
    now,
  };
}
