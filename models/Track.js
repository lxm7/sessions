import { Model } from '@nozbe/watermelondb';
import { field, date, text, relation, children, lazy } from '@nozbe/watermelondb/decorators';

export class Track extends Model {
  static table = 'tracks';

  static associations = {
    artists: { type: 'belongs_to', key: 'artist_id' },
    albums: { type: 'belongs_to', key: 'album_id' },
    playlist_tracks: { type: 'has_many', foreignKey: 'track_id' },
    favorites: { type: 'has_many', foreignKey: 'track_id' },
  };

  @text('title') title;
  @text('duration') duration;
  @text('audio_url') audioUrl;
  @text('cover_image_url') coverImageUrl;
  @text('genre') genre;
  @date('release_date') releaseDate;
  @date('created_at') createdAt;

  @relation('artists', 'artist_id') artist;
  @relation('albums', 'album_id') album;
  @children('playlist_tracks') playlistTracks;
  @children('favorites') favorites;
}
