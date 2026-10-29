-- MathsExpress Shop: real account coins, one-time cosmetic purchases and equip state.
-- No client can write a balance, alter prices or forge purchases. All state changes
-- execute as a transaction, checked against the authenticated student's own profile.
-- No payments, purchases with real money, gambling, or gameplay-changing power-ups.

create table public.shop_catalogue (
  id text primary key check (id ~ '^[a-z0-9-]{3,40}$'),
  name text not null,
  description text not null,
  category text not null check (category in ('theme', 'frame')),
  price integer not null check (price between 0 and 100000),
  active boolean not null default true
);

insert into public.shop_catalogue (id, name, description, category, price) values
  ('theme-ocean', 'Ocean Blue', 'A fresh ocean-blue dashboard accent.', 'theme', 40),
  ('theme-lavender', 'Lavender Sky', 'A soft purple and lavender accent.', 'theme', 60),
  ('theme-mint', 'Mint Breeze', 'A calm mint-coloured accent.', 'theme', 80),
  ('theme-sunset', 'Sunset Glow', 'Warm sunset colours on your dashboard.', 'theme', 100),
  ('frame-starlight', 'Starlight Frame', 'A sparkling outline for your account avatar.', 'frame', 35),
  ('frame-sky', 'Sky Frame', 'A bright blue ring around your avatar.', 'frame', 50),
  ('frame-royal', 'Royal Frame', 'A bold lavender outline.', 'frame', 75),
  ('frame-sunrise', 'Sunrise Frame', 'A warm golden outline.', 'frame', 90);

create table public.shop_wallets (
  student_id uuid primary key references public.profiles (id) on delete cascade,
  balance integer not null default 100 check (balance >= 0),
  equipped_theme text references public.shop_catalogue (id),
  equipped_frame text references public.shop_catalogue (id),
  created_at timestamptz not null default now()
);

create table public.shop_owned (
  student_id uuid not null references public.shop_wallets (student_id) on delete cascade,
  item_id text not null references public.shop_catalogue (id),
  purchased_at timestamptz not null default now(),
  primary key (student_id, item_id)
);

create table public.shop_transactions (
  id bigint generated always as identity primary key,
  student_id uuid not null references public.shop_wallets (student_id) on delete cascade,
  item_id text references public.shop_catalogue (id),
  delta integer not null check (delta <> 0),
  reason text not null check (reason in ('welcome', 'purchase', 'correct_answer')),
  created_at timestamptz not null default now()
);

create index shop_transactions_student_idx
  on public.shop_transactions (student_id, created_at desc);

create table public.shop_question_awards (
  student_id uuid not null references public.shop_wallets (student_id) on delete cascade,
  question_id text not null,
  created_at timestamptz not null default now(),
  primary key (student_id, question_id)
);

alter table public.shop_catalogue enable row level security;
alter table public.shop_wallets enable row level security;
alter table public.shop_owned enable row level security;
alter table public.shop_transactions enable row level security;
alter table public.shop_question_awards enable row level security;

revoke all on public.shop_catalogue, public.shop_wallets, public.shop_owned,
  public.shop_transactions, public.shop_question_awards from public, anon, authenticated;
revoke all on sequence public.shop_transactions_id_seq from public, anon, authenticated;

-- Called only from the explicit API functions, after require_student checks the
-- signed-in session. The unique wallet row and its welcome entry are created once.
create function private.shop_ensure_wallet(p_student uuid) returns void
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.shop_wallets (student_id) values (p_student)
  on conflict (student_id) do nothing;
  if found then
    insert into public.shop_transactions (student_id, delta, reason)
    values (p_student, 100, 'welcome');
  end if;
end;
$$;

create function private.shop_snapshot(p_student uuid) returns jsonb
language sql stable security definer set search_path = ''
as $$
  select jsonb_build_object(
    'balance', w.balance,
    'equippedTheme', w.equipped_theme,
    'equippedFrame', w.equipped_frame,
    'items', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', c.id, 'name', c.name, 'description', c.description,
        'category', c.category, 'price', c.price
      ) order by c.price, c.id)
      from public.shop_catalogue c where c.active), '[]'::jsonb
    ),
    'owned', coalesce(
      (select jsonb_agg(o.item_id order by o.item_id)
        from public.shop_owned o where o.student_id = p_student), '[]'::jsonb
    ),
    'transactions', coalesce(
      (select jsonb_agg(jsonb_build_object(
          'id', t.id, 'itemId', t.item_id, 'delta', t.delta,
          'reason', t.reason, 'createdAt', t.created_at
        ) order by t.created_at desc, t.id desc)
      from (
        select * from public.shop_transactions t
        where t.student_id = p_student order by t.created_at desc, t.id desc limit 20
      ) t), '[]'::jsonb
    )
  )
  from public.shop_wallets w where w.student_id = p_student;
$$;

create function public.shop_state() returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  student uuid := private.require_student();
begin
  perform private.shop_ensure_wallet(student);
  return private.shop_snapshot(student);
end;
$$;

-- Lock one wallet to serialize concurrent purchases and earnings. All writes and
-- affordability checks happen atomically, with item prices read on the server.
create function public.shop_buy(item_id text) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  student uuid := private.require_student();
  item public.shop_catalogue;
  coins integer;
begin
  perform private.shop_ensure_wallet(student);
  select w.balance into coins from public.shop_wallets w
  where w.student_id = student for update;
  select * into item from public.shop_catalogue c
  where c.id = shop_buy.item_id and c.active;
  if not found then perform private.fail('shop_item_unavailable'); end if;
  if exists (
    select 1 from public.shop_owned o
    where o.student_id = student and o.item_id = item.id
  ) then perform private.fail('shop_already_owned'); end if;
  if coins < item.price then perform private.fail('shop_not_enough_coins'); end if;
  update public.shop_wallets set balance = balance - item.price where student_id = student;
  insert into public.shop_owned (student_id, item_id) values (student, item.id);
  insert into public.shop_transactions (student_id, item_id, delta, reason)
    values (student, item.id, -item.price, 'purchase');
  return private.shop_snapshot(student);
end;
$$;

-- Equipping costs nothing and requires ownership; null unequips the requested category.
create function public.shop_equip(category text, item_id text default null) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  student uuid := private.require_student();
begin
  if shop_equip.category not in ('theme', 'frame') or shop_equip.category is null then
    perform private.fail('shop_invalid_category');
  end if;
  perform private.shop_ensure_wallet(student);
  perform 1 from public.shop_wallets w where w.student_id = student for update;
  if shop_equip.item_id is not null and not exists (
    select 1 from public.shop_owned o
    join public.shop_catalogue c on c.id = o.item_id
    where o.student_id = student and c.id = shop_equip.item_id
      and c.category = shop_equip.category and c.active
  ) then perform private.fail('shop_not_owned'); end if;
  if shop_equip.category = 'theme' then
    update public.shop_wallets set equipped_theme = shop_equip.item_id where student_id = student;
  else
    update public.shop_wallets set equipped_frame = shop_equip.item_id where student_id = student;
  end if;
  return private.shop_snapshot(student);
end;
$$;

-- The ONLY way to earn repeatable activity coins in this first release:
-- each of the published Year 9 guided-lesson questions awards 20 coins once.
-- Correct answers and year access are checked on the server, never trusted from React.
create function public.shop_award_answer(question_id text, answer text) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  student uuid := private.require_student();
  expected text;
  cleaned text;
begin
  if not exists (
    select 1 from public.class_members m
    where m.student_id = student and m.year_level = 9
  ) then perform private.fail('shop_lesson_unavailable'); end if;
  expected := case shop_award_answer.question_id
    when 'eq-1' then '5'
    when 'eq-2' then '5'
    when 'eq-3' then '-3'
    when 'eq-4' then '5'
    when 'eq-5' then '-4'
    else null end;
  if expected is null then perform private.fail('shop_question_unavailable'); end if;
  cleaned := replace(btrim(coalesce(shop_award_answer.answer, '')), '−', '-');
  if cleaned !~ '^[+-]?([0-9]+(\.[0-9]+)?|\.[0-9]+)$'
    or cleaned::numeric <> expected::numeric then
    perform private.fail('shop_answer_incorrect');
  end if;
  perform private.shop_ensure_wallet(student);
  perform 1 from public.shop_wallets w where w.student_id = student for update;
  insert into public.shop_question_awards (student_id, question_id)
    values (student, shop_award_answer.question_id)
    on conflict on constraint shop_question_awards_pkey do nothing;
  if not found then perform private.fail('shop_already_rewarded'); end if;
  update public.shop_wallets w set balance = balance + 20 where w.student_id = student;
  insert into public.shop_transactions (student_id, delta, reason)
    values (student, 20, 'correct_answer');
  return private.shop_snapshot(student);
end;
$$;

revoke all on function private.shop_ensure_wallet(uuid),
  private.shop_snapshot(uuid) from public, anon, authenticated;
revoke all on function public.shop_state(),
  public.shop_buy(text), public.shop_equip(text, text),
  public.shop_award_answer(text, text) from public, anon, authenticated;
grant execute on function public.shop_state(), public.shop_buy(text),
  public.shop_equip(text, text), public.shop_award_answer(text, text)
  to authenticated;
