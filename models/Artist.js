import { Model } from '@nozbe/watermelondb';
import { field, date, text, children } from '@nozbe/watermelondb/decorators';

export class Artist extends Model {
  static table = 'artists';

  static associations = {
    tracks: { type: 'has_many', foreignKey: 'artist_id' },
    albums: { type: 'has_many', foreignKey: 'artist_id' },
    events: { type: 'has_many', foreignKey: 'artist_id' },
  };

  @text('name') name;
  @text('bio') bio;
  @text('avatar_url') avatarUrl;
  @text('cover_image_url') coverImageUrl;
  @text('genre') genre;
  @date('created_at') createdAt;

  @children('tracks') tracks;
  @children('albums') albums;
  @children('events') events;
}
