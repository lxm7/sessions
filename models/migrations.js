import { schemaMigrations } from '@nozbe/watermelondb/Schema/migrations';

export const migrations = schemaMigrations({
  migrations: [
    // We start with version 1, so we don't need migrations yet
    // When adding new versions, define them here
    // Example:
    // {
    //   toVersion: 2,
    //   steps: [
    //     addColumns({
    //       table: 'users',
    //       columns: [
    //         { name: 'bio', type: 'string', isOptional: true }
    //       ]
    //     })
    //   ]
    // }
  ],
});
