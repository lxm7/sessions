import { Model } from '@nozbe/watermelondb';
import { date, text, relation, children } from '@nozbe/watermelondb/decorators';

export class Album extends Model {
  static table = 'albums';

  static associations = {
    artists: { type: 'belongs_to', key: 'artist_id' },
    tracks: { type: 'has_many', foreignKey: 'album_id' },
  };

  @text('title') title;
  @text('cover_image_url') coverImageUrl;
  @date('release_date') releaseDate;
  @date('created_at') createdAt;

  @relation('artists', 'artist_id') artist;
  @children('tracks') tracks;
}
