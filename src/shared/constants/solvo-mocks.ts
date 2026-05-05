import { ProviderData } from '@components';
import { PackageData } from '@components';

export const SOLVO_PROVIDERS: ProviderData[] = [
  {
    id: 1,
    name: 'Sabor Catering Co.',
    rating: 4.9,
    reviews: 312,
    priceLabel: '₡285,000',
    includes: [
      'Full service for 35 ppl',
      '3-course menu + drinks',
      'Setup & cleanup',
      '1 server included',
    ],
    tags: ['AI Match', 'Fast response'],
    responseTime: 'Replies in ~5 min',
    location: 'Santa Ana, 4 km away',
    avatar: '🍽️',
    verified: true,
    recommended: true,
  },
  {
    id: 2,
    name: 'Mesa Fina Eventos',
    rating: 4.8,
    reviews: 198,
    priceLabel: '₡320,000',
    includes: ['Premium menu', 'Dessert table', 'Wait staff (2)', 'Linen & decor'],
    tags: ['Premium'],
    responseTime: 'Replies in ~12 min',
    location: 'Escazú, 7 km away',
    avatar: '🥂',
    verified: true,
  },
  {
    id: 3,
    name: 'Cocina Express CR',
    rating: 4.6,
    reviews: 540,
    priceLabel: '₡215,000',
    includes: ['Buffet style', '2 main dishes', 'Self-serve setup'],
    tags: ['Best price'],
    responseTime: 'Replies in ~20 min',
    location: 'San José Centro, 12 km away',
    avatar: '🌮',
    verified: true,
  },
  {
    id: 4,
    name: 'La Buena Mesa',
    rating: 4.7,
    reviews: 156,
    priceLabel: '₡298,000',
    includes: ['Themed menu options', 'Dietary accommodations', 'Coffee bar add-on'],
    tags: ['Customizable'],
    responseTime: 'Replies in ~30 min',
    location: 'Santa Ana, 5 km away',
    avatar: '🥗',
    verified: true,
  },
];

export const SOLVO_PACKAGES: PackageData[] = [
  {
    tier: 'Essentials',
    emoji: '🎈',
    price: '₡245,000',
    saved: '₡18,000',
    tag: 'Best value',
    items: [
      { icon: '🍽️', label: 'Buffet catering', price: '₡165,000' },
      { icon: '🎈', label: 'Basic decoration', price: '₡35,000' },
      { icon: '🔊', label: 'Bluetooth speaker rental', price: '₡25,000' },
      { icon: '🎂', label: 'Bakery cake', price: '₡20,000' },
    ],
  },
  {
    tier: 'Balanced',
    emoji: '🎉',
    price: '₡380,000',
    saved: '₡42,000',
    tag: 'Most popular',
    featured: true,
    items: [
      { icon: '🍽️', label: 'Catering for 35', price: '₡215,000' },
      { icon: '🎈', label: 'Decoration & balloons', price: '₡68,000' },
      { icon: '🎧', label: 'DJ + sound system (4h)', price: '₡75,000' },
      { icon: '🎂', label: 'Custom cake (3 tier)', price: '₡22,000' },
    ],
  },
  {
    tier: 'Premium',
    emoji: '✨',
    price: '₡580,000',
    saved: '₡85,000',
    tag: 'Premium',
    items: [
      { icon: '🥂', label: 'Premium catering + bar', price: '₡340,000' },
      { icon: '🌸', label: 'Full event styling', price: '₡120,000' },
      { icon: '🎧', label: 'Live DJ + lights (5h)', price: '₡95,000' },
      { icon: '🎂', label: 'Designer cake', price: '₡25,000' },
    ],
  },
];

export const SOLVO_ACTIVE_REQUESTS = [
  { id: 1, title: 'Catering for 35 people', status: '3 quotes received', time: '2h ago', emoji: '🍽️', isNew: true },
  { id: 2, title: 'DJ for Saturday night', status: 'Waiting for replies', time: '5h ago', emoji: '🎧', isNew: false },
  { id: 3, title: 'AC repair — urgent', status: 'Booked with TecnoFrío', time: 'Yesterday', emoji: '❄️', booked: true },
];

export const SOLVO_CONVERSATIONS = [
  { name: 'Sabor Catering Co.', last: 'We can do Saturday at 6pm. Should I send a contract?', time: '2 min ago', emoji: '🍽️', unread: true },
  { name: 'DJ Mauricio', last: 'Yes, the package includes lights. Confirmed for 8pm-12am.', time: '1h ago', emoji: '🎧', unread: true },
  { name: 'Studio Luz', last: 'Sent you the portfolio — let me know what you think!', time: 'Yesterday', emoji: '📸', unread: false },
  { name: 'TecnoFrío', last: 'Job complete. Thank you!', time: '3 days ago', emoji: '❄️', unread: false },
];

export const SOLVO_SAVED = [
  { name: 'Sabor Catering Co.', rating: 4.9, category: 'Catering', emoji: '🍽️' },
  { name: 'Studio Luz Photography', rating: 4.8, category: 'Photography', emoji: '📸' },
  { name: 'DJ Mauricio', rating: 4.7, category: 'Music', emoji: '🎧' },
];

export const SOLVO_LEADS = [
  { id: 1, customer: 'Laura M.', request: 'Catering for 35 people, Saturday Nov 15', budget: '₡300,000', time: '12 min ago', urgent: true, location: 'Santa Ana' },
  { id: 2, customer: 'Diego S.', request: 'Corporate lunch — 60 people', budget: '₡480,000', time: '1h ago', urgent: false, location: 'Escazú' },
  { id: 3, customer: 'Patricia V.', request: 'Wedding cocktail reception, 80 ppl', budget: '₡950,000', time: '3h ago', urgent: false, location: 'Cariari' },
  { id: 4, customer: 'Roberto F.', request: 'Birthday — 25 people, casual', budget: '₡180,000', time: '5h ago', urgent: false, location: 'Curridabat' },
];
