/**
 * Seed: one topic's worth of real data ("Fast Food Showdown").
 *
 * Idempotent by design — every row carries a deterministic id derived from its
 * business key, and every write is an `upsert`. Re-running overwrites the seed
 * rows in place; nothing is deleted, so existing Player / Guess / Vote rows are
 * never disturbed.
 *
 * Run: npm run seed
 */
import { db } from './db';

const TOPIC_SLUG = 'fastfood';
const TOPIC_NAME = 'Fast Food Showdown';

// The three guessable stats, in a fixed order.
const STAT_KEYS = ['calories', 'price', 'sugar'] as const;
type StatKey = (typeof STAT_KEYS)[number];

const STAT_LABELS: Record<StatKey, string> = {
  calories: 'Calories',
  price: 'Price',
  sugar: 'Sugar',
};

const VOTE_DIMENSION = { key: 'taste', label: 'Which tastes better?' };

// `value` maps to a Postgres `numeric` column — pass it as a string so no
// float rounding happens on the way in.
//
// imageUrl is a placeholder (picsum.photos, seeded deterministically per item
// so it's stable across reseeds) until real product photos replace them.
type ItemSeed = { name: string; imageUrl: string } & Record<StatKey, string>;

const placeholderImage = (seed: string) => `https://picsum.photos/seed/${seed}/800/800`;

const ITEMS: ItemSeed[] = [
  { name: 'Big Mac', calories: '580', price: '5.99', sugar: '9', imageUrl: placeholderImage('big-mac') },
  { name: 'Whopper', calories: '677', price: '6.49', sugar: '11', imageUrl: placeholderImage('whopper') },
  { name: 'McChicken', calories: '400', price: '2.99', sugar: '5', imageUrl: placeholderImage('mcchicken') },
  { name: 'Baconator', calories: '950', price: '7.29', sugar: '9', imageUrl: placeholderImage('baconator') },
  { name: "McDonald's Medium Fries", calories: '320', price: '3.79', sugar: '0', imageUrl: placeholderImage('mcd-fries') },
  { name: 'BK Medium Fries', calories: '380', price: '3.49', sugar: '0', imageUrl: placeholderImage('bk-fries') },
  { name: 'McNuggets (10 pc)', calories: '420', price: '5.49', sugar: '0', imageUrl: placeholderImage('mcnuggets') },
  { name: "Wendy's Frosty (medium)", calories: '470', price: '3.29', sugar: '62', imageUrl: placeholderImage('frosty') },
  { name: 'Starbucks Caramel Frappuccino (Grande)', calories: '380', price: '5.45', sugar: '54', imageUrl: placeholderImage('frappuccino') },
];

// --- deterministic id helpers -------------------------------------------------
const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const topicId = `topic_${TOPIC_SLUG}`;
const statTypeId = (key: StatKey) => `stat_${TOPIC_SLUG}_${key}`;
const voteDimensionId = `votedim_${TOPIC_SLUG}_${VOTE_DIMENSION.key}`;
const itemId = (name: string) => `item_${TOPIC_SLUG}_${slugify(name)}`;
const statValueId = (name: string, key: StatKey) =>
  `sv_${TOPIC_SLUG}_${slugify(name)}_${key}`;

// ---------------------------------------------------------------------------

async function seed() {
  await db.transaction(async (tx) => {
    // 1. Topic
    await tx.orm.public.Topic.upsert({
      create: {
        id: topicId,
        slug: TOPIC_SLUG,
        name: TOPIC_NAME,
        description: null,
        isActive: true,
      },
      update: { slug: TOPIC_SLUG, name: TOPIC_NAME, description: null, isActive: true },
    });

    // 2. StatTypes (calories / price / sugar), all under the topic
    for (const key of STAT_KEYS) {
      await tx.orm.public.StatType.upsert({
        create: {
          id: statTypeId(key),
          topicId,
          key,
          label: STAT_LABELS[key],
          isGuessable: true,
        },
        update: { topicId, key, label: STAT_LABELS[key], isGuessable: true },
      });
    }

    // 3. VoteDimension (taste)
    await tx.orm.public.VoteDimension.upsert({
      create: {
        id: voteDimensionId,
        topicId,
        key: VOTE_DIMENSION.key,
        label: VOTE_DIMENSION.label,
      },
      update: { topicId, key: VOTE_DIMENSION.key, label: VOTE_DIMENSION.label },
    });

    // 4. Items, each with its three StatValues
    for (const item of ITEMS) {
      const iid = itemId(item.name);

      await tx.orm.public.Item.upsert({
        create: { id: iid, topicId, name: item.name, imageUrl: item.imageUrl },
        update: { topicId, name: item.name, imageUrl: item.imageUrl },
      });

      for (const key of STAT_KEYS) {
        await tx.orm.public.StatValue.upsert({
          create: {
            id: statValueId(item.name, key),
            itemId: iid,
            statTypeId: statTypeId(key),
            value: item[key],
          },
          update: { itemId: iid, statTypeId: statTypeId(key), value: item[key] },
        });
      }
    }
  });
}

async function report() {
  const [items, statValues, statTypes] = await Promise.all([
    db.orm.public.Item.where({ topicId }).aggregate((a) => ({ n: a.count() })),
    db.orm.public.StatValue.where((sv) =>
      sv.statType.some((st) => st.topicId.eq(topicId)),
    ).aggregate((a) => ({ n: a.count() })),
    db.orm.public.StatType.where({ topicId }).aggregate((a) => ({ n: a.count() })),
  ]);

  console.log(
    `Seeded "${TOPIC_SLUG}": 1 topic, ${statTypes.n} stat types, 1 vote dimension, ` +
      `${items.n} items, ${statValues.n} stat values.`,
  );
}

try {
  await seed();
  await report();
} finally {
  await db.close();
}
