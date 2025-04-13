import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'users',
      columns: [
        { name: 'email', type: 'string', isIndexed: true },
        { name: 'name', type: 'string' },
        { name: 'username', type: 'string', isOptional: true },
        { name: 'role', type: 'string' },
        { name: 'avatar_url', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'has_completed_onboarding', type: 'boolean' },
        { name: 'last_synced_at', type: 'string', isOptional: true },
      ],
    }),
    tableSchema({
      name: 'playlists',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'cover_image_url', type: 'string', isOptional: true },
        { name: 'is_public', type: 'boolean' },
        { name: 'created_at', type: 'number' },
        { name: 'updated_at', type: 'number' },
        { name: 'user_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'tracks',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'duration', type: 'string' },
        { name: 'audio_url', type: 'string' },
        { name: 'cover_image_url', type: 'string', isOptional: true },
        { name: 'genre', type: 'string', isOptional: true },
        { name: 'release_date', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'artist_id', type: 'string', isIndexed: true },
        { name: 'album_id', type: 'string', isIndexed: true, isOptional: true },
      ],
    }),
    tableSchema({
      name: 'artists',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'bio', type: 'string', isOptional: true },
        { name: 'avatar_url', type: 'string', isOptional: true },
        { name: 'cover_image_url', type: 'string', isOptional: true },
        { name: 'genre', type: 'string', isOptional: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'albums',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'cover_image_url', type: 'string', isOptional: true },
        { name: 'release_date', type: 'number' },
        { name: 'created_at', type: 'number' },
        { name: 'artist_id', type: 'string', isIndexed: true },
      ],
    }),
    tableSchema({
      name: 'playlist_tracks',
      columns: [
        { name: 'playlist_id', type: 'string', isIndexed: true },
        { name: 'track_id', type: 'string', isIndexed: true },
        { name: 'order', type: 'number' },
        { name: 'added_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'events',
      columns: [
        { name: 'title', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'start_date', type: 'number' },
        { name: 'end_date', type: 'number' },
        { name: 'location', type: 'string' },
        { name: 'image_url', type: 'string', isOptional: true },
        { name: 'ticket_price', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'artist_id', type: 'string', isIndexed: true, isOptional: true },
        { name: 'venue_id', type: 'string', isIndexed: true, isOptional: true },
      ],
    }),
    tableSchema({
      name: 'venues',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'address', type: 'string' },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'image_url', type: 'string', isOptional: true },
        { name: 'capacity', type: 'number', isOptional: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
    tableSchema({
      name: 'favorites',
      columns: [
        { name: 'user_id', type: 'string', isIndexed: true },
        { name: 'track_id', type: 'string', isIndexed: true },
        { name: 'created_at', type: 'number' },
      ],
    }),
  ],
});
