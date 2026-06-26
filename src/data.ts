import { Contact, Seeker, Gig, MarketItem, Message } from "./types";

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'contact_bongiwe',
    name: 'Bongiwe Mkhize',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    bio: 'Professional Web Developer & UI Designer',
    province: 'Gauteng',
    location: 'Sandton',
    picture: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'contact_sibusiso',
    name: 'Sibusiso Dlamini',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    bio: 'Independent Plumber & Handyman',
    province: 'Western Cape',
    location: 'Cape Town',
    picture: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80',
    createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString() // 25 hours ago
  },
];

export const INITIAL_SEEKERS: Seeker[] = [
  {
    id: 'seeker_1',
    name: 'Bongiwe Mkhize',
    bio: 'I construct ultra-modern websites, mobile apps, and e-commerce stores using React, Tailwind CSS, and Node.js. Fast delivery, clean South-African-crafted code.',
    location: 'Sandton',
    province: 'Gauteng',
    rate: 'R350/hr',
    portfolio: [{ type: 'image', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80' }]
  },
  {
    id: 'seeker_2',
    name: 'Sibusiso Dlamini',
    bio: 'Expert plumbing, pipe repair, leak detection, and appliance installation. Reliable, certified, and fully equipped with professional industrial tools.',
    location: 'Cape Town',
    province: 'Western Cape',
    rate: 'R180/hr',
    portfolio: [{ type: 'image', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80' }]
  },
];

export const INITIAL_GIGS: Gig[] = [
  {
    id: 'gig_1',
    title: 'React Developer Needed',
    description: 'Looking for a skilled developer to build a modern responsive dashboard for a logistics firm. Must have experience with charts and REST APIs.',
    price: 'R 12,000',
    province: 'Gauteng',
    location: 'Midrand',
    category: 'Tech & Design',
    ownerId: 'admin',
    ownerName: 'TimeGiG SA Admin',
    ownerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80' }],
    interestedCount: 4,
    appliedCount: 1
  },
  {
    id: 'gig_2',
    title: 'Bathroom Renovation Handyman',
    description: 'Need assistance with re-tiling and pipe laying for a medium-sized guest bathroom. Materials are already bought and on-site.',
    price: 'R 4,500',
    province: 'Western Cape',
    location: 'Stellenbosch',
    category: 'Home Services',
    ownerId: 'admin',
    ownerName: 'TimeGiG SA Admin',
    ownerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80' }],
    interestedCount: 2,
    appliedCount: 0
  },
];

export const INITIAL_MARKET_ITEMS: MarketItem[] = [
  {
    id: 'market_1',
    name: 'MacBook Pro 14" M1 (8GB/512GB)',
    description: 'Excellent condition, space grey color, 94% battery health. Comes with original charger and box.',
    price: 16500.00,
    portfolio: [{ type: 'image', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80' }],
    type: 'sale',
    province: 'Gauteng',
    location: 'Pretoria',
    ownerId: 'admin',
    ownerName: 'TimeGiG SA Admin',
    interestedCount: 12,
    appliedCount: 1
  },
  {
    id: 'market_2',
    name: 'Professional DSLR Camera Tripod',
    description: 'Heavy-duty aluminum travel tripod with 3-way fluid pan head. Supports up to 8kg payload.',
    price: 850.00,
    portfolio: [{ type: 'image', url: 'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=600&q=80' }],
    type: 'sale',
    province: 'KwaZulu-Natal',
    location: 'Durban North',
    ownerId: 'admin',
    ownerName: 'TimeGiG SA Admin',
    interestedCount: 3,
    appliedCount: 0
  },
  {
    id: 'market_3',
    name: 'Wanted: Second-hand Electric Guitar',
    description: 'Looking for a beginner electric guitar (Squier, Yamaha Pacifica, or Ibanez). Budget is flexible around R2000.',
    price: 2000.00,
    portfolio: [{ type: 'image', url: 'https://images.unsplash.com/photo-1508186224248-db0293c76a19?auto=format&fit=crop&w=600&q=80' }],
    type: 'wanted',
    province: 'Western Cape',
    location: 'George',
    ownerId: 'admin',
    ownerName: 'TimeGiG SA Admin',
    interestedCount: 5,
    appliedCount: 2
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 1,
    text: "Hi! I saw your portfolio. Are you available for a project?",
    sender: 'contact',
    liked: false,
    reactions: [],
    contactId: 'contact_bongiwe'
  },
  {
    id: 2,
    text: "Hello! Yes, I am. What do you have in mind?",
    sender: 'user',
    liked: false,
    reactions: [],
    contactId: 'contact_bongiwe'
  }
];
