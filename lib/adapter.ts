import { type LokiAdapterOptions } from '@nozbe/watermelondb/adapters/lokijs';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import { SQLiteAdapterOptions } from '@nozbe/watermelondb/adapters/sqlite/type';

export const createAdapter = (
  options: Pick<
    SQLiteAdapterOptions,
    // Accept only the options shared between SQLiteAdapterOptions and LokiAdapterOptions
    Extract<keyof SQLiteAdapterOptions, keyof LokiAdapterOptions>
  >
) =>
  new SQLiteAdapter({
    jsi: true,
    ...options,
  });
