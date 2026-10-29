import { describe, expect, it } from 'vitest';
import { admin, anonClient, createSignedInUser, createStudent, createTeacher } from './helpers.ts';

describe('profiles', () => {
  it('creates a profile once, with the chosen role and tidied names', async () => {
    const user = await createSignedInUser('profile');
    const { data, error } = await user.client.rpc('complete_profile', {
      role: 'student',
      first_name: '  Mia  ',
      last_name: 'van   der Berg',
    });
    expect(error).toBeNull();
    expect(data).toMatchObject({
      id: user.id,
      role: 'student',
      first_name: 'Mia',
      last_name: 'van der Berg',
    });

    const again = await user.client.rpc('complete_profile', {
      role: 'teacher',
      first_name: 'Mia',
      last_name: 'Chen',
    });
    expect(again.error?.message).toBe('profile_exists');

    const { data: stored } = await admin.from('profiles').select('role').eq('id', user.id).single();
    expect(stored?.role).toBe('student');
  });

  it('rejects empty or overly long names', async () => {
    const user = await createSignedInUser('profile-names');
    const empty = await user.client.rpc('complete_profile', {
      role: 'student',
      first_name: '   ',
      last_name: 'Chen',
    });
    const tooLong = await user.client.rpc('complete_profile', {
      role: 'student',
      first_name: 'A'.repeat(51),
      last_name: 'Chen',
    });
    expect(empty.error?.message).toBe('invalid_name');
    expect(tooLong.error?.message).toBe('invalid_name');
  });

  it('lets users rename themselves but never change their role', async () => {
    const student = await createStudent('Sam', 'Lee');
    const { data, error } = await student.client.rpc('update_my_name', {
      first_name: 'Samuel',
      last_name: 'Lee',
    });
    expect(error).toBeNull();
    expect(data).toMatchObject({ first_name: 'Samuel', role: 'student' });

    const direct = await student.client
      .from('profiles')
      .update({ role: 'teacher' })
      .eq('id', student.id);
    expect(direct.error?.code).toBe('42501');
    const { data: stored } = await admin
      .from('profiles')
      .select('role')
      .eq('id', student.id)
      .single();
    expect(stored?.role).toBe('student');
  });

  it('shows each user only their own profile', async () => {
    const student = await createStudent();
    const teacher = await createTeacher();

    const { data: own } = await student.client.from('profiles').select('id');
    expect(own).toEqual([{ id: student.id }]);

    const { data: other } = await student.client.from('profiles').select('id').eq('id', teacher.id);
    expect(other).toEqual([]);
  });

  it('gives visitors who are not signed in no access at all', async () => {
    const visitor = anonClient();
    const { error: readError } = await visitor.from('profiles').select('id');
    const { error: callError } = await visitor.rpc('complete_profile', {
      role: 'teacher',
      first_name: 'Not',
      last_name: 'Allowed',
    });
    expect(readError?.code).toBe('42501');
    expect(callError?.code).toBe('42501');
  });

  it('blocks direct profile reads from a signed-out session with an unexpired token', async () => {
    const student = await createStudent();
    const { data: sessionData } = await student.client.auth.getSession();
    const token = sessionData.session?.access_token;
    const baseUrl = process.env.TEST_SUPABASE_URL;
    const apiKey = process.env.TEST_SUPABASE_ANON_KEY;
    if (!token || !baseUrl || !apiKey) throw new Error('Test credentials are missing');
    const readWithOldToken = async () => {
      const response = await fetch(`${baseUrl}/rest/v1/profiles?select=id`, {
        headers: { apikey: apiKey, Authorization: `Bearer ${token}` },
      });
      return { status: response.status, body: await response.json() };
    };
    const before = await readWithOldToken();
    expect(before.status).toBe(200);
    expect(before.body).toEqual([{ id: student.id }]);

    const { error: signOutError } = await student.client.auth.signOut();
    expect(signOutError).toBeNull();

    const after = await readWithOldToken();
    if (after.status === 200) {
      expect(after.body).toEqual([]);
    } else {
      expect([401, 403]).toContain(after.status);
    }
  });

  it('requires a profile before any class action', async () => {
    const user = await createSignedInUser('no-profile');
    const { error } = await user.client.rpc('my_classes');
    expect(error?.message).toBe('profile_required');
  });
});

describe('who can set up an account', () => {
  it('needs a session opened from an email link, not just the password', async () => {
    // Someone who registered the address first knows its password, but never had the email:
    // the password can't even open a session until the account is set up.
    const user = await createSignedInUser('password-only');
    const withPassword = await anonClient().auth.signInWithPassword({
      email: user.email,
      password: user.password,
    });
    expect(withPassword.error?.message).toBe('email_link_required');
    expect(withPassword.data.session).toBeNull();

    const fromLink = await createSignedInUser('from-link');
    const { data: linkAge } = await fromLink.client.rpc('email_sign_in_age');
    expect(linkAge).toBeGreaterThanOrEqual(0);
    expect(linkAge).toBeLessThan(60);
    const allowed = await fromLink.client.rpc('complete_profile', {
      role: 'student',
      first_name: 'Real',
      last_name: 'Owner',
    });
    expect(allowed.error).toBeNull();
  });

  it('does not let signed-out visitors ask about sessions', async () => {
    const { error } = await anonClient().rpc('email_sign_in_age');
    expect(error?.code).toBe('42501');
  });
});
