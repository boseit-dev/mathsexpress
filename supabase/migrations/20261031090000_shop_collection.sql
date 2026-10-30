-- MathsExpress Shop: the full cosmetic catalogue, rarities, a slot for each kind of cosmetic,
-- free starter items, restoring the default look, and coins for finishing lessons.
--
-- Builds on the coin shop (20261029010000_coin_shop.sql). The server still owns every price,
-- balance and ownership record: the browser only names the item it wants. Purchases lock the
-- student's wallet row, so two requests at once are handled one after the other and coins are
-- taken exactly once. Everything is cosmetic: no real money, random rewards or advantages.

-- ===========================================================================================
-- Catalogue
-- ===========================================================================================

alter table public.shop_catalogue
  drop constraint shop_catalogue_category_check,
  add constraint shop_catalogue_category_check check (category in
    ('avatar', 'accessory', 'background', 'frame', 'effect', 'title', 'theme')),
  add column rarity text not null default 'common'
    check (rarity in ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  add column sort_order integer not null default 0;

-- The artwork for each item ships with the website, keyed by these ids. A database test checks
-- this list matches `src/domain/shopCatalogue.ts`.
insert into public.shop_catalogue
  (id, name, description, category, price, rarity, sort_order)
values
  ('av-capybara', 'MathsExpress Capybara', 'The original MathsExpress capybara.', 'avatar', 0, 'common', 1),
  ('av-fox', 'Fox', 'A quick-thinking fox with a bright tail of ideas.', 'avatar', 0, 'common', 2),
  ('av-owl', 'Owl', 'A wise owl who loves a tricky problem.', 'avatar', 0, 'common', 3),
  ('av-cat', 'Cat', 'A curious cat, always counting things.', 'avatar', 50, 'common', 4),
  ('av-panda', 'Panda', 'A calm panda who never rushes a step.', 'avatar', 75, 'common', 5),
  ('av-koala', 'Koala', 'A sleepy koala who wakes up for maths.', 'avatar', 100, 'uncommon', 6),
  ('av-axolotl', 'Axolotl', 'A smiley axolotl with frilly pink gills.', 'avatar', 150, 'uncommon', 7),
  ('av-robot-bolt', 'Bolt the Robot', 'A friendly robot with a square head.', 'avatar', 200, 'uncommon', 8),
  ('av-cube', 'Cube Buddy', 'A cheerful cube with six happy faces.', 'avatar', 250, 'uncommon', 9),
  ('av-pi', 'Pi Pal', 'A never-ending friend: 3.14159…', 'avatar', 300, 'rare', 10),
  ('av-capy-scientist', 'Scientist Capybara', 'Goggles on, ready to test ideas.', 'avatar', 400, 'rare', 11),
  ('av-robot-orbit', 'Orbit Bot', 'A round robot with a spinning antenna.', 'avatar', 450, 'rare', 12),
  ('av-alien', 'Friendly Alien', 'A visitor who came for the algebra.', 'avatar', 500, 'rare', 13),
  ('av-capy-explorer', 'Explorer Capybara', 'Hat on, map out, ready to explore.', 'avatar', 600, 'rare', 14),
  ('av-capy-astronaut', 'Astronaut Capybara', 'The first capybara in orbit.', 'avatar', 800, 'epic', 15),
  ('av-capy-wizard', 'Wizard Capybara', 'Turns problems into solutions.', 'avatar', 1000, 'epic', 16),
  ('av-star-sprite', 'Star Sprite', 'A tiny star spirit that glows brighter.', 'avatar', 1200, 'epic', 17),
  ('av-cyber-knight', 'Cyber Knight', 'A futuristic knight with a visor.', 'avatar', 1800, 'epic', 18),
  ('av-dragon', 'Little Dragon', 'A small dragon with a big heart.', 'avatar', 2200, 'epic', 19),
  ('av-robot-mega', 'Mega Mech', 'A gleaming mech built for big problems.', 'avatar', 2500, 'epic', 20),
  ('av-capy-golden', 'Golden Capybara', 'A shining golden capybara.', 'avatar', 4000, 'legendary', 21),
  ('av-nebula', 'Nebula Spirit', 'A spirit made of stars and starlight.', 'avatar', 5000, 'legendary', 22),
  ('acc-pencil', 'Lucky Pencil', 'A sharp pencil for every working step.', 'accessory', 0, 'common', 23),
  ('acc-books', 'Stack of Books', 'Three good books, ready to read.', 'accessory', 25, 'common', 24),
  ('acc-snowflake', 'Snowflake Charm', 'Six-way symmetry, frozen in place.', 'accessory', 30, 'common', 25),
  ('acc-football', 'Football', 'A classic black-and-white football.', 'accessory', 40, 'common', 26),
  ('acc-basketball', 'Basketball', 'Nothing but net.', 'accessory', 50, 'common', 27),
  ('acc-sunglasses', 'Cool Shades', 'Bright blue sunglasses.', 'accessory', 60, 'common', 28),
  ('acc-calculator', 'Pocket Calculator', 'For checking, not for thinking.', 'accessory', 75, 'common', 29),
  ('acc-lightning', 'Lightning Bolt', 'A bolt of quick thinking.', 'accessory', 120, 'uncommon', 30),
  ('acc-headphones', 'Study Headphones', 'Focus mode: on.', 'accessory', 150, 'uncommon', 31),
  ('acc-grad-cap', 'Graduation Cap', 'Dressed for the big day.', 'accessory', 200, 'uncommon', 32),
  ('acc-rainbow-cloud', 'Rainbow Cloud', 'A little cloud with a rainbow.', 'accessory', 250, 'uncommon', 33),
  ('acc-mini-rocket', 'Mini Rocket', 'Ready for lift-off.', 'accessory', 350, 'rare', 34),
  ('acc-floating-planet', 'Floating Planet', 'A ringed planet in a tiny orbit.', 'accessory', 400, 'rare', 35),
  ('acc-wizard-hat', 'Wizard Hat', 'Starry, pointy and very wise.', 'accessory', 450, 'rare', 36),
  ('acc-crystal-orb', 'Crystal Orb', 'It sees the answer… after you work it out.', 'accessory', 500, 'rare', 37),
  ('acc-mini-robot', 'Mini Robot', 'A tiny robot helper on your shoulder.', 'accessory', 600, 'rare', 38),
  ('acc-treasure-chest', 'Treasure Chest', 'Full of gold coins you earned.', 'accessory', 900, 'epic', 39),
  ('acc-space-helmet', 'Space Helmet', 'A clear bubble helmet for space walks.', 'accessory', 1000, 'epic', 40),
  ('acc-golden-football', 'Golden Football', 'A football made of shining gold.', 'accessory', 1500, 'epic', 41),
  ('acc-crown', 'Royal Crown', 'A golden crown with blue gems.', 'accessory', 2000, 'epic', 42),
  ('acc-trophy', 'Golden Trophy', 'For champions of practice.', 'accessory', 2500, 'epic', 43),
  ('acc-mini-dragon', 'Mini Dragon', 'A pocket-sized dragon friend.', 'accessory', 3500, 'legendary', 44),
  ('acc-infinity-halo', 'Infinity Halo', 'A glowing ring shaped like ∞.', 'accessory', 4500, 'legendary', 45),
  ('bg-lavender-hills', 'Lavender Hills', 'Soft lavender skies and gentle hills.', 'background', 0, 'common', 46),
  ('bg-classic-blue', 'Classic Blue', 'MathsExpress blue with a grid of dots.', 'background', 0, 'common', 47),
  ('bg-dreamy-clouds', 'Dreamy Clouds', 'Floating pillowy clouds.', 'background', 60, 'common', 48),
  ('bg-sunset-beach', 'Sunset Beach', 'A warm sunset over calm waves.', 'background', 75, 'common', 49),
  ('bg-rainforest', 'Rainforest', 'Tall trees and big green leaves.', 'background', 150, 'uncommon', 50),
  ('bg-snowy-mountains', 'Snowy Mountains', 'Crisp peaks and falling snow.', 'background', 200, 'uncommon', 51),
  ('bg-deep-ocean', 'Deep Ocean', 'Deep blue water and rising bubbles.', 'background', 250, 'uncommon', 52),
  ('bg-football-stadium', 'Football Stadium', 'Bright lights on match night.', 'background', 350, 'rare', 53),
  ('bg-moon-surface', 'Moon Surface', 'Craters, stars and Earth far away.', 'background', 400, 'rare', 54),
  ('bg-neon-city', 'Neon City', 'A city skyline glowing at night.', 'background', 600, 'rare', 55),
  ('bg-underwater-kingdom', 'Underwater Kingdom', 'Coral towers under the sea.', 'background', 800, 'epic', 56),
  ('bg-cyber-grid', 'Cyber Grid', 'A glowing digital world.', 'background', 1000, 'epic', 57),
  ('bg-northern-lights', 'Northern Lights', 'Green and violet lights in the sky.', 'background', 1500, 'epic', 58),
  ('bg-cosmic-galaxy', 'Cosmic Galaxy', 'A swirling galaxy far from home.', 'background', 2000, 'epic', 59),
  ('bg-golden-palace', 'Golden Palace', 'Golden arches and royal blue.', 'background', 3500, 'legendary', 60),
  ('bg-maths-universe', 'Maths Universe', 'A universe built from maths.', 'background', 5000, 'legendary', 61),
  ('frame-classic', 'Classic Ring', 'A clean MathsExpress blue ring.', 'frame', 0, 'common', 62),
  ('frame-starlight', 'Starlight Frame', 'A sparkling outline.', 'frame', 35, 'common', 63),
  ('frame-sky', 'Sky Frame', 'A bright blue ring.', 'frame', 50, 'common', 64),
  ('frame-royal', 'Royal Frame', 'A bold lavender outline.', 'frame', 75, 'common', 65),
  ('frame-sunrise', 'Sunrise Frame', 'A warm golden outline.', 'frame', 100, 'uncommon', 66),
  ('frame-lavender-glow', 'Lavender Glow', 'A soft lavender glow.', 'frame', 150, 'uncommon', 67),
  ('frame-rainbow', 'Rainbow Outline', 'Every colour in one ring.', 'frame', 300, 'rare', 68),
  ('frame-electric', 'Electric Border', 'A crackling blue border.', 'frame', 500, 'rare', 69),
  ('frame-crystal', 'Crystal Frame', 'Cut-crystal facets all the way round.', 'frame', 900, 'epic', 70),
  ('frame-golden', 'Golden Frame', 'Polished gold with a fine edge.', 'frame', 1200, 'epic', 71),
  ('frame-cosmic', 'Cosmic Ring', 'A ring of deep space and stars.', 'frame', 2000, 'epic', 72),
  ('frame-diamond', 'Diamond Frame', 'Diamonds set around a silver ring.', 'frame', 3000, 'legendary', 73),
  ('frame-star-orbit', 'Orbiting Stars', 'Stars that slowly circle you.', 'frame', 4000, 'legendary', 74),
  ('fx-sparkles', 'Little Sparkles', 'A few tiny twinkles.', 'effect', 40, 'common', 75),
  ('fx-bubbles', 'Bubbles', 'Bubbles drifting gently upwards.', 'effect', 60, 'common', 76),
  ('fx-floating-stars', 'Floating Stars', 'Small stars floating around.', 'effect', 75, 'common', 77),
  ('fx-snowfall', 'Snowfall', 'Soft snow, falling slowly.', 'effect', 150, 'uncommon', 78),
  ('fx-maths-symbols', 'Floating Maths', '+, −, × and ÷ drifting by.', 'effect', 200, 'uncommon', 79),
  ('fx-confetti', 'Confetti', 'A little celebration, always on.', 'effect', 250, 'uncommon', 80),
  ('fx-fireflies', 'Fireflies', 'Warm lights glowing in the dark.', 'effect', 300, 'rare', 81),
  ('fx-rainbow-particles', 'Rainbow Particles', 'Tiny dots in every colour.', 'effect', 500, 'rare', 82),
  ('fx-soft-lightning', 'Soft Lightning', 'Gentle flashes of blue light.', 'effect', 900, 'epic', 83),
  ('fx-colour-trail', 'Colour Trail', 'A ribbon of colour that loops around.', 'effect', 1200, 'epic', 84),
  ('fx-aurora-glow', 'Aurora Glow', 'A shimmering curtain of light.', 'effect', 2000, 'epic', 85),
  ('fx-golden-aura', 'Golden Aura', 'A warm golden glow and rays.', 'effect', 3000, 'legendary', 86),
  ('title-maths-explorer', 'Maths Explorer', 'A title for every curious mind.', 'title', 0, 'common', 87),
  ('title-number-whiz', 'Number Whiz', 'Quick with numbers.', 'title', 50, 'common', 88),
  ('title-problem-solver', 'Problem Solver', 'Never gives up on a question.', 'title', 100, 'uncommon', 89),
  ('title-equation-ace', 'Equation Ace', 'Balances both sides every time.', 'title', 250, 'uncommon', 90),
  ('title-pattern-pro', 'Pattern Pro', 'Spots the pattern first.', 'title', 400, 'rare', 91),
  ('title-fraction-hero', 'Fraction Hero', 'Halves, quarters, no problem.', 'title', 600, 'rare', 92),
  ('title-coin-collector', 'Coin Collector', 'Saved up for something special.', 'title', 1500, 'epic', 93),
  ('title-maths-legend', 'Maths Legend', 'The rarest title in MathsExpress.', 'title', 5000, 'legendary', 94),
  ('theme-ocean', 'Ocean Blue', 'A fresh ocean-blue dashboard accent.', 'theme', 40, 'common', 95),
  ('theme-lavender', 'Lavender Sky', 'A soft purple and lavender accent.', 'theme', 60, 'common', 96),
  ('theme-mint', 'Mint Breeze', 'A calm mint-coloured accent.', 'theme', 75, 'common', 97),
  ('theme-sunset', 'Sunset Glow', 'Warm sunset colours on your dashboard.', 'theme', 100, 'uncommon', 98)
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  price = excluded.price,
  rarity = excluded.rarity,
  sort_order = excluded.sort_order,
  active = true;

-- Each rarity has its own price band, so a "legendary" item can never be cheap or vice versa.
alter table public.shop_catalogue
  add constraint shop_catalogue_rarity_price_check check (
    (rarity = 'common' and price between 0 and 75)
    or (rarity = 'uncommon' and price between 100 and 250)
    or (rarity = 'rare' and price between 300 and 600)
    or (rarity = 'epic' and price between 750 and 2500)
    or (rarity = 'legendary' and price between 3000 and 5000)
  );

-- ===========================================================================================
-- Equipped items: one per category
-- ===========================================================================================

create table public.shop_equipped (
  student_id uuid not null references public.shop_wallets (student_id) on delete cascade,
  category text not null,
  item_id text not null references public.shop_catalogue (id),
  updated_at timestamptz not null default now(),
  primary key (student_id, category)
);

alter table public.shop_equipped enable row level security;
revoke all on public.shop_equipped from public, anon, authenticated;

insert into public.shop_equipped (student_id, category, item_id)
select student_id, 'theme', equipped_theme from public.shop_wallets where equipped_theme is not null
union all
select student_id, 'frame', equipped_frame from public.shop_wallets where equipped_frame is not null;

alter table public.shop_wallets drop column equipped_theme, drop column equipped_frame;

alter table public.shop_transactions
  drop constraint shop_transactions_reason_check,
  add constraint shop_transactions_reason_check
    check (reason in ('welcome', 'purchase', 'correct_answer', 'lesson_complete'));

-- ===========================================================================================
-- Reading the shop
-- ===========================================================================================

-- True when the student may wear the item: they bought it, or it is a free starter item.
create function private.shop_owns(p_student uuid, p_item text) returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.shop_catalogue c
    where c.id = p_item and c.active and c.price = 0
  ) or exists (
    select 1 from public.shop_owned o where o.student_id = p_student and o.item_id = p_item
  );
$$;

create or replace function private.shop_snapshot(p_student uuid) returns jsonb
language sql stable security definer set search_path = ''
as $$
  select jsonb_build_object(
    'balance', w.balance,
    'equipped', coalesce(
      (select jsonb_object_agg(e.category, e.item_id)
        from public.shop_equipped e where e.student_id = p_student), '{}'::jsonb
    ),
    'items', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'id', c.id, 'name', c.name, 'description', c.description,
        'category', c.category, 'price', c.price, 'rarity', c.rarity
      ) order by c.sort_order, c.id)
      from public.shop_catalogue c where c.active), '[]'::jsonb
    ),
    'owned', coalesce(
      (select jsonb_agg(c.id order by c.sort_order, c.id)
        from public.shop_catalogue c
        where (c.active and c.price = 0)
          or exists (
            select 1 from public.shop_owned o where o.student_id = p_student and o.item_id = c.id
          )), '[]'::jsonb
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

-- ===========================================================================================
-- Buying, equipping and restoring the default look
-- ===========================================================================================

-- The wallet row is locked first, so a second request for the same student waits, then sees the
-- item is owned. The price is read here, never sent by the browser.
create or replace function public.shop_buy(item_id text) returns jsonb
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
  if private.shop_owns(student, item.id) then perform private.fail('shop_already_owned'); end if;
  if coins < item.price then perform private.fail('shop_not_enough_coins'); end if;
  update public.shop_wallets set balance = balance - item.price where student_id = student;
  insert into public.shop_owned (student_id, item_id) values (student, item.id);
  insert into public.shop_transactions (student_id, item_id, delta, reason)
    values (student, item.id, -item.price, 'purchase');
  return private.shop_snapshot(student);
end;
$$;

-- Equipping costs nothing and needs ownership; a null item takes that category off.
create or replace function public.shop_equip(category text, item_id text default null)
returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  student uuid := private.require_student();
begin
  if shop_equip.category is null or shop_equip.category not in
    ('avatar', 'accessory', 'background', 'frame', 'effect', 'title', 'theme') then
    perform private.fail('shop_invalid_category');
  end if;
  perform private.shop_ensure_wallet(student);
  perform 1 from public.shop_wallets w where w.student_id = student for update;
  if shop_equip.item_id is null then
    delete from public.shop_equipped e
    where e.student_id = student and e.category = shop_equip.category;
    return private.shop_snapshot(student);
  end if;
  if not exists (
    select 1 from public.shop_catalogue c
    where c.id = shop_equip.item_id and c.category = shop_equip.category and c.active
  ) or not private.shop_owns(student, shop_equip.item_id) then
    perform private.fail('shop_not_owned');
  end if;
  insert into public.shop_equipped (student_id, category, item_id)
  values (student, shop_equip.category, shop_equip.item_id)
  on conflict on constraint shop_equipped_pkey
    do update set item_id = excluded.item_id, updated_at = now();
  return private.shop_snapshot(student);
end;
$$;

-- Back to the default MathsExpress look. Owned items stay owned.
create function public.shop_reset_look() returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  student uuid := private.require_student();
begin
  perform private.shop_ensure_wallet(student);
  perform 1 from public.shop_wallets w where w.student_id = student for update;
  delete from public.shop_equipped e where e.student_id = student;
  return private.shop_snapshot(student);
end;
$$;

-- What each current student in a class wears, for their teacher's class lists. Only the parts of
-- a look that appear on an avatar are shared; dashboard themes and effects stay private.
create function public.class_member_looks(class_id uuid) returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform private.require_class_teacher(class_member_looks.class_id);
  return coalesce((
    select jsonb_object_agg(m.student_id, looks.look)
    from public.class_members m
    cross join lateral (
      select coalesce(jsonb_object_agg(e.category, e.item_id), '{}'::jsonb) as look
      from public.shop_equipped e
      where e.student_id = m.student_id
        and e.category in ('avatar', 'accessory', 'background', 'frame', 'title')
    ) looks
    where m.class_id = class_member_looks.class_id
  ), '{}'::jsonb);
end;
$$;

-- ===========================================================================================
-- Coins for finishing a lesson
-- ===========================================================================================

-- Finishing a lesson earns 25 coins plus 5 for each question right first time. Only the first
-- four lessons finished each day (Sydney time) earn coins, so practice is rewarded fairly but
-- repeating one lesson all day is not.
create function private.shop_award_lesson(p_student uuid, p_attempt uuid) returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  day_start timestamptz :=
    date_trunc('day', now() at time zone 'Australia/Sydney') at time zone 'Australia/Sydney';
  rewarded_today integer;
  first_try integer;
  amount integer;
begin
  perform private.shop_ensure_wallet(p_student);
  perform 1 from public.shop_wallets w where w.student_id = p_student for update;
  select count(*)::integer into rewarded_today
  from public.shop_transactions t
  where t.student_id = p_student and t.reason = 'lesson_complete' and t.created_at >= day_start;
  if rewarded_today >= 4 then
    return 0;
  end if;
  select count(*)::integer into first_try
  from public.attempt_questions q
  where q.attempt_id = p_attempt and q.first_try_correct;
  amount := 25 + 5 * first_try;
  update public.shop_wallets w set balance = balance + amount where w.student_id = p_student;
  insert into public.shop_transactions (student_id, delta, reason)
    values (p_student, amount, 'lesson_complete');
  return amount;
end;
$$;

-- As in 20261030120000_tasks_and_progress.sql, plus the lesson reward the moment an attempt is
-- first completed. The reward is saved in the same transaction as the answer.
create or replace function public.record_answer(
  attempt_id uuid,
  question_id text,
  answer text,
  hints_used integer default 0
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  student uuid := private.require_student();
  attempt public.lesson_attempts;
  expected numeric;
  cleaned text := replace(btrim(coalesce(record_answer.answer, '')), '−', '-');
  is_correct boolean;
  row_state public.attempt_questions;
  remaining integer;
  coins integer := 0;
begin
  select a.* into attempt
  from public.lesson_attempts a
  where a.id = record_answer.attempt_id and a.student_id = student
  for update;
  if not found then
    perform private.fail('attempt_not_found');
  end if;

  select q.answer into expected
  from public.learning_questions q
  where q.content_id = attempt.content_id and q.question_id = record_answer.question_id;
  if not found then
    perform private.fail('question_not_found');
  end if;

  if cleaned !~ '^[+-]?([0-9]+(\.[0-9]+)?|\.[0-9]+)$' or char_length(cleaned) > 20 then
    perform private.fail('invalid_answer');
  end if;
  is_correct := cleaned::numeric = expected;

  select q.* into row_state
  from public.attempt_questions q
  where q.attempt_id = attempt.id and q.question_id = record_answer.question_id;

  if found and row_state.solved_at is not null then
    return jsonb_build_object('correct', is_correct, 'alreadySolved', true,
      'completed', attempt.completed_at is not null, 'coinsAwarded', 0);
  end if;

  insert into public.attempt_questions
    (attempt_id, question_id, tries, hints_used, first_try_correct, solved_at)
  values
    (attempt.id, record_answer.question_id, 1,
     least(greatest(coalesce(record_answer.hints_used, 0), 0), 10),
     is_correct, case when is_correct then now() end)
  on conflict on constraint attempt_questions_pkey do update
    set tries = least(public.attempt_questions.tries + 1, 32000),
        hints_used = greatest(public.attempt_questions.hints_used, excluded.hints_used),
        solved_at = case when is_correct then now() end;

  select count(*)::integer into remaining
  from public.learning_questions q
  where q.content_id = attempt.content_id
    and not exists (
      select 1 from public.attempt_questions aq
      where aq.attempt_id = attempt.id and aq.question_id = q.question_id
        and aq.solved_at is not null
    );

  update public.lesson_attempts a
  set last_activity_at = now(),
      completed_at = case when remaining = 0 then coalesce(a.completed_at, now()) else a.completed_at end
  where a.id = attempt.id;

  if remaining = 0 and attempt.completed_at is null then
    coins := private.shop_award_lesson(student, attempt.id);
  end if;

  return jsonb_build_object('correct', is_correct, 'alreadySolved', false,
    'completed', remaining = 0, 'coinsAwarded', coins);
end;
$$;

-- ===========================================================================================
-- Permissions
-- ===========================================================================================

revoke all on function
  private.shop_owns(uuid, text),
  private.shop_snapshot(uuid),
  private.shop_award_lesson(uuid, uuid)
from public, anon, authenticated;
revoke all on function
  public.shop_buy(text),
  public.shop_equip(text, text),
  public.shop_reset_look(),
  public.class_member_looks(uuid),
  public.record_answer(uuid, text, text, integer)
from public, anon;
grant execute on function
  public.shop_buy(text),
  public.shop_equip(text, text),
  public.shop_reset_look(),
  public.class_member_looks(uuid),
  public.record_answer(uuid, text, text, integer)
to authenticated;
