import { Model } from '@nozbe/watermelondb';
import { field, date, text, children } from '@nozbe/watermelondb/decorators';

export class Venue extends Model {
  static table = 'venues';

  static associations = {
    events: { type: 'has_many', foreignKey: 'venue_id' },
  };

  @text('name') name;
  @text('address') address;
  @text('description') description;
  @text('image_url') imageUrl;
  @field('capacity') capacity;
  @date('created_at') createdAt;

  @children('events') events;
}
