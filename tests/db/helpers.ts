// Helpers for the database integration tests. Every account they create uses a unique
// @example.test address (a reserved test domain) and exists only in the local stack.
import { randomUUID } from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../../src/data/supabase/database.types.ts';

export type Client = SupabaseClient<Database>;
export type TeacherClass = Database['public']['CompositeTypes']['teacher_class'];

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set. Run these tests with: npm run test:db`);
  return value;
}

const url = requireEnv('TEST_SUPABASE_URL');
const anonKey = requireEnv('TEST_SUPABASE_ANON_KEY');
const serviceRoleKey = requireEnv('TEST_SUPABASE_SERVICE_ROLE_KEY');
const mailpitUrl = requireEnv('TEST_MAILPIT_URL');

const clientOptions = { auth: { persistSession: false, autoRefreshToken: false } };

/** A client with no signed-in user, like a visitor who has not signed in. */
export function anonClient(): Client {
  return createClient<Database>(url, anonKey, clientOptions);
}

/** Bypasses all access rules. Only for setting up and inspecting test data. */
export const admin = createClient<Database>(url, serviceRoleKey, clientOptions);

export function uniqueEmail(label: string): string {
  return `${label}-${randomUUID().slice(0, 8)}@example.test`;
}

/** A password that meets the policy (8+ characters with letters and digits). */
export function testPassword(): string {
  return `Test-${randomUUID().slice(0, 8)}-42`;
}

export interface TestUser {
  id: string;
  email: string;
  password: string;
  client: Client;
}

/** A confirmed account, signed in, without a profile yet. */
export async function createSignedInUser(label: string): Promise<TestUser> {
  const email = uniqueEmail(label);
  const password = testPassword();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw error;
  const client = anonClient();
  const { error: signInError } = await client.auth.signInWithPassword({ email, password });
  if (signInError) throw signInError;
  return { id: data.user.id, email, password, client };
}

export async function createTeacher(firstName = 'Test', lastName = 'Teacher'): Promise<TestUser> {
  const user = await createSignedInUser('teacher');
  const { error } = await user.client.rpc('complete_profile', {
    role: 'teacher',
    first_name: firstName,
    last_name: lastName,
  });
  if (error) throw error;
  return user;
}

export async function createStudent(firstName = 'Test', lastName = 'Student'): Promise<TestUser> {
  const user = await createSignedInUser('student');
  const { error } = await user.client.rpc('complete_profile', {
    role: 'student',
    first_name: firstName,
    last_name: lastName,
  });
  if (error) throw error;
  return user;
}

export interface CreatedClass {
  id: string;
  name: string;
  year_level: number;
  join_code: string;
}

/** Creates a class as the teacher and returns it, checking every field came back. */
export async function createClass(
  teacher: TestUser,
  name = 'Test class',
  yearLevel = 9,
): Promise<CreatedClass & TeacherClass> {
  const { data, error } = await teacher.client.rpc('create_class', {
    name,
    year_level: yearLevel,
  });
  if (error) throw error;
  if (
    data.id === null ||
    data.name === null ||
    data.year_level === null ||
    data.join_code === null
  ) {
    throw new Error('create_class returned an incomplete class');
  }
  return {
    ...data,
    id: data.id,
    name: data.name,
    year_level: data.year_level,
    join_code: data.join_code,
  };
}

interface MailpitSummary {
  ID: string;
  Subject: string;
}

/** Waits for the newest email sent to `address` by the local stack and returns its HTML. */
export async function latestEmailTo(address: string, subjectIncludes: string): Promise<string> {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    const search = await fetch(
      `${mailpitUrl}/api/v1/search?query=${encodeURIComponent(`to:"${address}"`)}`,
    );
    const { messages } = (await search.json()) as { messages: MailpitSummary[] };
    const match = messages.find((message) => message.Subject.includes(subjectIncludes));
    if (match) {
      const message = await fetch(`${mailpitUrl}/api/v1/message/${match.ID}`);
      const { HTML } = (await message.json()) as { HTML: string };
      return HTML;
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`No "${subjectIncludes}" email arrived for ${address}`);
}

/** The token_hash from a MathsExpress email link to /auth/confirm. */
export function tokenHashFromEmail(html: string): string {
  const match = /\/auth\/confirm\?token_hash=([^&"]+)&amp;type=(\w+)/.exec(html);
  if (!match?.[1]) throw new Error('The email has no MathsExpress confirmation link');
  return match[1];
}
