// No imports, so the database tests can load this file directly.

/** The kinds of cosmetic. One of each can be worn at a time. */
export type CosmeticCategory =
  'avatar' | 'accessory' | 'background' | 'frame' | 'effect' | 'title' | 'theme';

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface ShopProduct {
  id: string;
  name: string;
  description: string;
  category: CosmeticCategory;
  price: number;
  rarity: Rarity;
}

type Entry = [id: string, name: string, price: number, rarity: Rarity, description: string];

function group(category: CosmeticCategory, entries: readonly Entry[]): ShopProduct[] {
  return entries.map(([id, name, price, rarity, description]) => ({
    id,
    name,
    description,
    category,
    price,
    rarity,
  }));
}

/**
 * Every cosmetic in the shop. The database holds the real list and prices
 * (`supabase/migrations/20261031090000_shop_collection.sql`); a database test checks the two
 * match, and a unit test checks every item has artwork. Cosmetic only: nothing here changes
 * questions, marks or hints.
 */
export const SHOP_CATALOGUE: readonly ShopProduct[] = [
  ...group('avatar', [
    ['av-capybara', 'MathsExpress Capybara', 0, 'common', 'The original MathsExpress capybara.'],
    ['av-fox', 'Fox', 0, 'common', 'A quick-thinking fox with a bright tail of ideas.'],
    ['av-owl', 'Owl', 0, 'common', 'A wise owl who loves a tricky problem.'],
    ['av-cat', 'Cat', 50, 'common', 'A curious cat, always counting things.'],
    ['av-panda', 'Panda', 75, 'common', 'A calm panda who never rushes a step.'],
    ['av-bunny', 'Bunny', 75, 'common', 'A bouncy bunny who hops through times tables.'],
    ['av-koala', 'Koala', 100, 'uncommon', 'A sleepy koala who wakes up for maths.'],
    ['av-axolotl', 'Axolotl', 150, 'uncommon', 'A smiley axolotl with frilly pink gills.'],
    ['av-robot-bolt', 'Bolt the Robot', 200, 'uncommon', 'A friendly robot with a square head.'],
    ['av-cube', 'Cube Buddy', 250, 'uncommon', 'A cheerful cube with six happy faces.'],
    ['av-hedgehog', 'Hedgehog', 250, 'uncommon', 'Small, spiky and very sharp at sums.'],
    ['av-pi', 'Pi Pal', 300, 'rare', 'A never-ending friend: 3.14159…'],
    ['av-capy-scientist', 'Scientist Capybara', 400, 'rare', 'Goggles on, ready to test ideas.'],
    ['av-robot-orbit', 'Orbit Bot', 450, 'rare', 'A round robot with a spinning antenna.'],
    ['av-alien', 'Friendly Alien', 500, 'rare', 'A visitor who came for the algebra.'],
    ['av-capy-explorer', 'Explorer Capybara', 600, 'rare', 'Hat on, map out, ready to explore.'],
    ['av-capy-astronaut', 'Astronaut Capybara', 800, 'epic', 'The first capybara in orbit.'],
    ['av-capy-wizard', 'Wizard Capybara', 1000, 'epic', 'Turns problems into solutions.'],
    ['av-unicorn', 'Unicorn', 1500, 'epic', 'A rainbow-maned unicorn who loves patterns.'],
    ['av-star-sprite', 'Star Sprite', 1200, 'epic', 'A tiny star spirit that glows brighter.'],
    ['av-cyber-knight', 'Cyber Knight', 1800, 'epic', 'A futuristic knight with a visor.'],
    ['av-dragon', 'Little Dragon', 2200, 'epic', 'A small dragon with a big heart.'],
    ['av-robot-mega', 'Mega Mech', 2500, 'epic', 'A gleaming mech built for big problems.'],
    ['av-capy-golden', 'Golden Capybara', 4000, 'legendary', 'A shining golden capybara.'],
    ['av-nebula', 'Nebula Spirit', 5000, 'legendary', 'A spirit made of stars and starlight.'],
  ]),
  ...group('accessory', [
    ['acc-pencil', 'Lucky Pencil', 0, 'common', 'A sharp pencil for every working step.'],
    ['acc-books', 'Stack of Books', 25, 'common', 'Three good books, ready to read.'],
    ['acc-snowflake', 'Snowflake Charm', 30, 'common', 'Six-way symmetry, frozen in place.'],
    ['acc-bow-tie', 'Bow Tie', 40, 'common', 'Smart, neat and ready for class.'],
    ['acc-football', 'Football', 40, 'common', 'A classic black-and-white football.'],
    ['acc-basketball', 'Basketball', 50, 'common', 'Nothing but net.'],
    ['acc-party-hat', 'Party Hat', 50, 'common', 'For celebrating every finished lesson.'],
    ['acc-sunglasses', 'Cool Shades', 60, 'common', 'Bright blue sunglasses.'],
    ['acc-calculator', 'Pocket Calculator', 75, 'common', 'For checking, not for thinking.'],
    ['acc-lightning', 'Lightning Bolt', 120, 'uncommon', 'A bolt of quick thinking.'],
    ['acc-protractor', 'Protractor', 120, 'uncommon', 'Every angle, measured.'],
    ['acc-headphones', 'Study Headphones', 150, 'uncommon', 'Focus mode: on.'],
    ['acc-scarf', 'Cosy Scarf', 150, 'uncommon', 'A warm striped scarf.'],
    ['acc-grad-cap', 'Graduation Cap', 200, 'uncommon', 'Dressed for the big day.'],
    ['acc-rainbow-cloud', 'Rainbow Cloud', 250, 'uncommon', 'A little cloud with a rainbow.'],
    ['acc-mini-rocket', 'Mini Rocket', 350, 'rare', 'Ready for lift-off.'],
    ['acc-floating-planet', 'Floating Planet', 400, 'rare', 'A ringed planet in a tiny orbit.'],
    ['acc-wizard-hat', 'Wizard Hat', 450, 'rare', 'Starry, pointy and very wise.'],
    ['acc-crystal-orb', 'Crystal Orb', 500, 'rare', 'It sees the answer… after you work it out.'],
    ['acc-mini-robot', 'Mini Robot', 600, 'rare', 'A tiny robot helper on your shoulder.'],
    ['acc-treasure-chest', 'Treasure Chest', 900, 'epic', 'Full of gold coins you earned.'],
    ['acc-star-wand', 'Star Wand', 900, 'epic', 'A wand with a shining star on top.'],
    ['acc-space-helmet', 'Space Helmet', 1000, 'epic', 'A clear bubble helmet for space walks.'],
    ['acc-golden-football', 'Golden Football', 1500, 'epic', 'A football made of shining gold.'],
    ['acc-crown', 'Royal Crown', 2000, 'epic', 'A golden crown with blue gems.'],
    ['acc-trophy', 'Golden Trophy', 2500, 'epic', 'For champions of practice.'],
    ['acc-mini-dragon', 'Mini Dragon', 3500, 'legendary', 'A pocket-sized dragon friend.'],
    ['acc-infinity-halo', 'Infinity Halo', 4500, 'legendary', 'A glowing ring shaped like ∞.'],
  ]),
  ...group('background', [
    ['bg-lavender-hills', 'Lavender Hills', 0, 'common', 'Soft lavender skies and gentle hills.'],
    ['bg-classic-blue', 'Classic Blue', 0, 'common', 'MathsExpress blue with a grid of dots.'],
    ['bg-chalkboard', 'Chalkboard', 50, 'common', 'A classroom board full of maths.'],
    ['bg-dreamy-clouds', 'Dreamy Clouds', 60, 'common', 'Floating pillowy clouds.'],
    ['bg-sunset-beach', 'Sunset Beach', 75, 'common', 'A warm sunset over calm waves.'],
    ['bg-autumn-forest', 'Autumn Forest', 100, 'uncommon', 'Orange leaves and tall trees.'],
    ['bg-rainforest', 'Rainforest', 150, 'uncommon', 'Tall trees and big green leaves.'],
    ['bg-snowy-mountains', 'Snowy Mountains', 200, 'uncommon', 'Crisp peaks and falling snow.'],
    ['bg-deep-ocean', 'Deep Ocean', 250, 'uncommon', 'Deep blue water and rising bubbles.'],
    ['bg-football-stadium', 'Football Stadium', 350, 'rare', 'Bright lights on match night.'],
    ['bg-desert-dunes', 'Desert Dunes', 300, 'rare', 'Golden dunes under a big sun.'],
    ['bg-moon-surface', 'Moon Surface', 400, 'rare', 'Craters, stars and Earth far away.'],
    ['bg-neon-city', 'Neon City', 600, 'rare', 'A city skyline glowing at night.'],
    ['bg-underwater-kingdom', 'Underwater Kingdom', 800, 'epic', 'Coral towers under the sea.'],
    ['bg-volcano-island', 'Volcano Island', 900, 'epic', 'A smoking volcano far out at sea.'],
    ['bg-cyber-grid', 'Cyber Grid', 1000, 'epic', 'A glowing digital world.'],
    ['bg-northern-lights', 'Northern Lights', 1500, 'epic', 'Green and violet lights in the sky.'],
    ['bg-cosmic-galaxy', 'Cosmic Galaxy', 2000, 'epic', 'A swirling galaxy far from home.'],
    ['bg-golden-palace', 'Golden Palace', 3500, 'legendary', 'Golden arches and royal blue.'],
    ['bg-maths-universe', 'Maths Universe', 5000, 'legendary', 'A universe built from maths.'],
  ]),
  ...group('frame', [
    ['frame-classic', 'Classic Ring', 0, 'common', 'A clean MathsExpress blue ring.'],
    ['frame-starlight', 'Starlight Frame', 35, 'common', 'A sparkling outline.'],
    ['frame-sky', 'Sky Frame', 50, 'common', 'A bright blue ring.'],
    ['frame-royal', 'Royal Frame', 75, 'common', 'A bold lavender outline.'],
    ['frame-sunrise', 'Sunrise Frame', 100, 'uncommon', 'A warm golden outline.'],
    ['frame-lavender-glow', 'Lavender Glow', 150, 'uncommon', 'A soft lavender glow.'],
    ['frame-leafy', 'Leafy Wreath', 200, 'uncommon', 'A ring of fresh green leaves.'],
    ['frame-rainbow', 'Rainbow Outline', 300, 'rare', 'Every colour in one ring.'],
    ['frame-pixel', 'Pixel Frame', 400, 'rare', 'A blocky frame from a retro game.'],
    ['frame-electric', 'Electric Border', 500, 'rare', 'A crackling blue border.'],
    ['frame-crystal', 'Crystal Frame', 900, 'epic', 'Cut-crystal facets all the way round.'],
    ['frame-golden', 'Golden Frame', 1200, 'epic', 'Polished gold with a fine edge.'],
    ['frame-blossom', 'Blossom Frame', 1500, 'epic', 'Pink blossoms all the way round.'],
    ['frame-cosmic', 'Cosmic Ring', 2000, 'epic', 'A ring of deep space and stars.'],
    ['frame-diamond', 'Diamond Frame', 3000, 'legendary', 'Diamonds set around a silver ring.'],
    ['frame-star-orbit', 'Orbiting Stars', 4000, 'legendary', 'Stars that slowly circle you.'],
  ]),
  ...group('effect', [
    ['fx-sparkles', 'Little Sparkles', 40, 'common', 'A few tiny twinkles.'],
    ['fx-bubbles', 'Bubbles', 60, 'common', 'Bubbles drifting gently upwards.'],
    ['fx-floating-stars', 'Floating Stars', 75, 'common', 'Small stars floating around.'],
    ['fx-hearts', 'Floating Hearts', 100, 'uncommon', 'Little hearts drifting upwards.'],
    ['fx-snowfall', 'Snowfall', 150, 'uncommon', 'Soft snow, falling slowly.'],
    ['fx-maths-symbols', 'Floating Maths', 200, 'uncommon', '+, −, × and ÷ drifting by.'],
    ['fx-confetti', 'Confetti', 250, 'uncommon', 'A little celebration, always on.'],
    ['fx-fireflies', 'Fireflies', 300, 'rare', 'Warm lights glowing in the dark.'],
    ['fx-falling-leaves', 'Falling Leaves', 400, 'rare', 'Autumn leaves floating down.'],
    ['fx-rainbow-particles', 'Rainbow Particles', 500, 'rare', 'Tiny dots in every colour.'],
    ['fx-soft-lightning', 'Soft Lightning', 900, 'epic', 'Gentle flashes of blue light.'],
    ['fx-number-rain', 'Number Rain', 750, 'epic', 'Digits gently falling like rain.'],
    ['fx-colour-trail', 'Colour Trail', 1200, 'epic', 'A ribbon of colour that loops around.'],
    ['fx-aurora-glow', 'Aurora Glow', 2000, 'epic', 'A shimmering curtain of light.'],
    ['fx-golden-aura', 'Golden Aura', 3000, 'legendary', 'A warm golden glow and rays.'],
  ]),
  ...group('title', [
    ['title-maths-explorer', 'Maths Explorer', 0, 'common', 'A title for every curious mind.'],
    ['title-quick-thinker', 'Quick Thinker', 25, 'common', 'Fast and thoughtful.'],
    ['title-number-whiz', 'Number Whiz', 50, 'common', 'Quick with numbers.'],
    ['title-problem-solver', 'Problem Solver', 100, 'uncommon', 'Never gives up on a question.'],
    [
      'title-algebra-adventurer',
      'Algebra Adventurer',
      150,
      'uncommon',
      'Exploring the world of x.',
    ],
    ['title-equation-ace', 'Equation Ace', 250, 'uncommon', 'Balances both sides every time.'],
    ['title-graph-guru', 'Graph Guru', 300, 'rare', 'Plots it perfectly.'],
    ['title-pattern-pro', 'Pattern Pro', 400, 'rare', 'Spots the pattern first.'],
    ['title-geometry-genius', 'Geometry Genius', 450, 'rare', 'Shapes, angles and proofs.'],
    ['title-fraction-hero', 'Fraction Hero', 600, 'rare', 'Halves, quarters, no problem.'],
    ['title-coin-collector', 'Coin Collector', 1500, 'epic', 'Saved up for something special.'],
    ['title-number-wizard', 'Number Wizard', 2000, 'epic', 'Makes numbers do magic.'],
    [
      'title-infinity-beyond',
      'Infinity and Beyond',
      4000,
      'legendary',
      'No limit to this learner.',
    ],
    ['title-maths-legend', 'Maths Legend', 5000, 'legendary', 'The rarest title in MathsExpress.'],
  ]),
  ...group('theme', [
    ['theme-ocean', 'Ocean Blue', 40, 'common', 'A fresh ocean-blue dashboard accent.'],
    ['theme-lavender', 'Lavender Sky', 60, 'common', 'A soft purple and lavender accent.'],
    ['theme-mint', 'Mint Breeze', 75, 'common', 'A calm mint-coloured accent.'],
    ['theme-forest', 'Forest Green', 75, 'common', 'Deep forest greens on your dashboard.'],
    ['theme-sunset', 'Sunset Glow', 100, 'uncommon', 'Warm sunset colours on your dashboard.'],
    ['theme-cherry', 'Cherry Blossom', 150, 'uncommon', 'Soft blossom pinks.'],
    ['theme-arctic', 'Arctic Teal', 200, 'uncommon', 'Cool icy teals.'],
    ['theme-citrus', 'Citrus Pop', 250, 'uncommon', 'Bright orange and lemon tones.'],
    ['theme-berry', 'Berry Burst', 400, 'rare', 'Rich berry purples.'],
    ['theme-volcano', 'Volcano Red', 600, 'rare', 'Bold lava reds.'],
    ['theme-midnight', 'Midnight Navy', 1200, 'epic', 'A deep midnight blue.'],
    ['theme-royal-gold', 'Royal Gold', 3000, 'legendary', 'Gleaming gold accents fit for royalty.'],
  ]),
];
