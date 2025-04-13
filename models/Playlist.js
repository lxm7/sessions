import { Model } from '@nozbe/watermelondb';
import { field, date, text, relation, children, lazy } from '@nozbe/watermelondb/decorators';

export class Playlist extends Model {
  static table = 'playlists';

  static associations = {
    users: { type: 'belongs_to', key: 'user_id' },
    playlist_tracks: { type: 'has_many', foreignKey: 'playlist_id' },
  };

  @text('name') name;
  @text('description') description;
  @text('cover_image_url') coverImageUrl;
  @field('is_public') isPublic;
  @date('created_at') createdAt;
  @date('updated_at') updatedAt;

  @relation('users', 'user_id') user;
  @children('playlist_tracks') playlistTracks;

  @lazy
  tracks = this.collections
    .get('tracks')
    .query(Q.on('playlist_tracks', 'playlist_id', this.id))
    .observe();
}
