import { Model } from '@nozbe/watermelondb';
import { field, date, text, relation } from '@nozbe/watermelondb/decorators';

export class Event extends Model {
  static table = 'events';

  static associations = {
    users: { type: 'belongs_to', key: 'user_id' },
    artists: { type: 'belongs_to', key: 'artist_id' },
    venues: { type: 'belongs_to', key: 'venue_id' },
  };

  @text('title') title;
  @text('description') description;
  @date('start_date') startDate;
  @date('end_date') endDate;
  @text('location') location;
  @text('image_url') imageUrl;
  @field('ticket_price') ticketPrice;
  @date('created_at') createdAt;

  @relation('users', 'user_id') user;
  @relation('artists', 'artist_id') artist;
  @relation('venues', 'venue_id') venue;
}
