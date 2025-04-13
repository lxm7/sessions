import { Model } from '@nozbe/watermelondb';
import { field, date, readonly, text, relation, children } from '@nozbe/watermelondb/decorators';

export class User extends Model {
  static table = 'users';

  static associations = {
    playlists: { type: 'has_many', foreignKey: 'user_id' },
    favorites: { type: 'has_many', foreignKey: 'user_id' },
    events: { type: 'has_many', foreignKey: 'user_id' },
  };

  @text('email') email;
  @text('name') name;
  @text('username') username;
  @text('role') role;
  @text('avatar_url') avatarUrl;
  @date('created_at') createdAt;
  @field('has_completed_onboarding') hasCompletedOnboarding;
  @text('last_synced_at') lastSyncedAt;

  @children('playlists') playlists;
  @children('favorites') favorites;
  @children('events') events;
}
