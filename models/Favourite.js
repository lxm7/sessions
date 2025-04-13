import { Model } from '@nozbe/watermelondb';
import { date, relation } from '@nozbe/watermelondb/decorators';

export class Favourite extends Model {
  static table = 'favorites';

  static associations = {
    users: { type: 'belongs_to', key: 'user_id' },
    tracks: { type: 'belongs_to', key: 'track_id' },
  };

  @date('created_at') createdAt;

  @relation('users', 'user_id') user;
  @relation('tracks', 'track_id') track;
}
