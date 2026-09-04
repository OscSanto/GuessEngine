#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/3e9be6cd56200b240cf5c3d908e8e37d352bfad5175a461268aa057049b9d36f/contract';
import endContract from '../../snapshots/3e9be6cd56200b240cf5c3d908e8e37d352bfad5175a461268aa057049b9d36f/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/87d51d0fb434fe2cf613fc4ebd5b392e182a967e90d8bdd5eb4cc9d057b8a329/contract';
import startContract from '../../snapshots/87d51d0fb434fe2cf613fc4ebd5b392e182a967e90d8bdd5eb4cc9d057b8a329/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'guess',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isCorrect', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('itemAId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('itemBId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('mode', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('playerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('responseMs', 'int4', { codecRef: { codecId: 'pg/int4@1' } }),
          col('statTypeId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userAnswer', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'player',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('token', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'vote',
        columns: [
          col('choice', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz-temporal@1' },
          }),
          col('dimensionId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('itemAId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('itemBId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('playerId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'player',
        constraint: 'player_token_key',
        columns: ['token'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'guess',
        index: 'guess_itemAId_itemBId_statTypeId_idx_d0432812',
        columns: ['itemAId', 'itemBId', 'statTypeId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'guess',
        index: 'guess_playerId_idx_710cf1aa',
        columns: ['playerId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'vote',
        index: 'vote_dimensionId_idx_4706127b',
        columns: ['dimensionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'vote',
        index: 'vote_dimensionId_itemAId_itemBId_idx_ef0c39f5',
        columns: ['dimensionId', 'itemAId', 'itemBId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'vote',
        index: 'vote_playerId_idx_710cf1aa',
        columns: ['playerId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'guess',
        foreignKey: {
          name: 'guess_playerId_fkey',
          columns: ['playerId'],
          references: { schema: 'public', table: 'player', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'vote',
        foreignKey: {
          name: 'vote_playerId_fkey',
          columns: ['playerId'],
          references: { schema: 'public', table: 'player', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'vote',
        foreignKey: {
          name: 'vote_dimensionId_fkey',
          columns: ['dimensionId'],
          references: { schema: 'public', table: 'voteDimension', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
