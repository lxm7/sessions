import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';

export class PlaylistTrack extends Model {
  static table = 'playlist_tracks';

  static associations = {
    playlists: { type: 'belongs_to', key: 'playlist_id' },
    tracks: { type: 'belongs_to', key: 'track_id' },
  };

  @field('order') order;
  @date('added_at') addedAt;

  @relation('playlists', 'playlist_id') playlist;
  @relation('tracks', 'track_id') track;
}
