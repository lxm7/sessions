import LokiJSAdapter, { type LokiAdapterOptions } from '@nozbe/watermelondb/adapters/lokijs';
import { type SQLiteAdapterOptions } from '@nozbe/watermelondb/adapters/sqlite/type';

export const createAdapter = (
  options: Pick<
    LokiAdapterOptions,
    // Accept only the options shared between LokiAdapterOptions and SQLiteAdapterOptions
    Extract<keyof LokiAdapterOptions, keyof SQLiteAdapterOptions>
  >
) =>
  new LokiJSAdapter({
    useWebWorker: false,
    useIncrementalIndexedDB: true,
    ...options,
  });
