#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/87d51d0fb434fe2cf613fc4ebd5b392e182a967e90d8bdd5eb4cc9d057b8a329/contract';
import endContract from '../../snapshots/87d51d0fb434fe2cf613fc4ebd5b392e182a967e90d8bdd5eb4cc9d057b8a329/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<never, End> {
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createSchema({ schema: 'public' }),
      this.createTable({
        schema: 'public',
        table: 'item',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('topicId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'statType',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isGuessable', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('key', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('label', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('topicId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'statValue',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('itemId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('statTypeId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('value', 'numeric', { notNull: true, codecRef: { codecId: 'pg/numeric@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'topic',
        columns: [
          col('description', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isActive', 'bool', {
            notNull: true,
            default: lit(true),
            codecRef: { codecId: 'pg/bool@1' },
          }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'voteDimension',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('key', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('label', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('topicId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'statType',
        constraint: 'statType_topicId_key_key',
        columns: ['topicId', 'key'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'statValue',
        constraint: 'statValue_itemId_statTypeId_key',
        columns: ['itemId', 'statTypeId'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'topic',
        constraint: 'topic_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'voteDimension',
        constraint: 'voteDimension_topicId_key_key',
        columns: ['topicId', 'key'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'item',
        index: 'item_topicId_idx_6f05808f',
        columns: ['topicId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'statType',
        index: 'statType_topicId_idx_6f05808f',
        columns: ['topicId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'statValue',
        index: 'statValue_itemId_idx_41357140',
        columns: ['itemId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'statValue',
        index: 'statValue_statTypeId_idx_4f96df42',
        columns: ['statTypeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'voteDimension',
        index: 'voteDimension_topicId_idx_6f05808f',
        columns: ['topicId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'item',
        foreignKey: {
          name: 'item_topicId_fkey',
          columns: ['topicId'],
          references: { schema: 'public', table: 'topic', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'statType',
        foreignKey: {
          name: 'statType_topicId_fkey',
          columns: ['topicId'],
          references: { schema: 'public', table: 'topic', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'statValue',
        foreignKey: {
          name: 'statValue_itemId_fkey',
          columns: ['itemId'],
          references: { schema: 'public', table: 'item', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'statValue',
        foreignKey: {
          name: 'statValue_statTypeId_fkey',
          columns: ['statTypeId'],
          references: { schema: 'public', table: 'statType', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'voteDimension',
        foreignKey: {
          name: 'voteDimension_topicId_fkey',
          columns: ['topicId'],
          references: { schema: 'public', table: 'topic', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
