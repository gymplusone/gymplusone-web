/**
 * Public event listings (read model) — mirrors private-event fields for display.
 * TODO: Replace with API GET /events/:id
 */

export type EventIconName =
  | 'film-outline'
  | 'barbell-outline'
  | 'restaurant-outline'
  | 'cafe-outline'
  | 'moon-outline';

export type PublicEventDetail = {
  id: string;
  title: string;
  /** Shown on list row under title */
  listStatusLine: string;
  icon?: EventIconName;
  /** Remote image for hero; omit for placeholder */
  imageUri?: string;
  dateLabel: string;
  timeLabel: string;
  locationLabel: string;
  /** Passed to maps URL query */
  mapsQuery: string;
  creator: {
    name: string;
    avatarInitial: string;
  };
};

export const MOCK_PUBLIC_EVENTS: PublicEventDetail[] = [
  {
    id: '1',
    title: 'Bromley Film',
    listStatusLine: 'Date to be agreed',
    icon: 'film-outline',
    imageUri:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
    dateLabel: 'Saturday, 12 April 2026',
    timeLabel: '19:30 – 22:00',
    locationLabel: 'Odeon Bromley, High St, Bromley BR1 1HA',
    mapsQuery: 'Odeon Bromley High Street',
    creator: { name: 'Sasha Kaley', avatarInitial: 'S' },
  },
  {
    id: '2',
    title: 'Pure gym Girlies',
    listStatusLine: 'Date to be agreed',
    icon: 'barbell-outline',
    imageUri:
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
    dateLabel: 'Wednesday, 9 April 2026',
    timeLabel: '18:00 – 19:30',
    locationLabel: 'PureGym London Stratford, E15',
    mapsQuery: 'PureGym Stratford London',
    creator: { name: 'Jordan', avatarInitial: 'J' },
  },
  {
    id: '3',
    title: 'Lets grab a bite',
    listStatusLine: 'Date to be agreed',
    icon: 'restaurant-outline',
    dateLabel: 'Friday, 11 April 2026',
    timeLabel: '19:00 – 21:00',
    locationLabel: 'Dishoom Shoreditch, London',
    mapsQuery: 'Dishoom Shoreditch',
    creator: { name: 'Jamie', avatarInitial: 'J' },
  },
  {
    id: '4',
    title: 'Coffee or drinks',
    listStatusLine: 'Date to be agreed',
    icon: 'cafe-outline',
    imageUri:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
    dateLabel: 'Sunday, 13 April 2026',
    timeLabel: '15:00 – 17:00',
    locationLabel: 'Notes Coffee, Canary Wharf',
    mapsQuery: 'Notes Coffee Canary Wharf',
    creator: { name: 'Morgan', avatarInitial: 'M' },
  },
  {
    id: '5',
    title: 'Something outdoors',
    listStatusLine: 'Date to be agreed',
    dateLabel: 'Date to be agreed',
    timeLabel: 'TBC',
    locationLabel: 'Hyde Park, London (meet at Speakers’ Corner)',
    mapsQuery: 'Hyde Park Speakers Corner',
    creator: { name: 'Taylor', avatarInitial: 'T' },
  },
  {
    id: '6',
    title: 'Night out',
    listStatusLine: 'Date to be agreed',
    icon: 'moon-outline',
    dateLabel: 'Saturday, 19 April 2026',
    timeLabel: '21:00 – late',
    locationLabel: 'Soho, London — details in chat',
    mapsQuery: 'Soho London',
    creator: { name: 'Casey', avatarInitial: 'C' },
  },
];

export function getPublicEventById(id: string): PublicEventDetail | undefined {
  return MOCK_PUBLIC_EVENTS.find((e) => e.id === id);
}

export function getPublicEventListItems() {
  return MOCK_PUBLIC_EVENTS.map((e) => ({
    id: e.id,
    title: e.title,
    statusLine: e.listStatusLine,
    icon: e.icon,
  }));
}
