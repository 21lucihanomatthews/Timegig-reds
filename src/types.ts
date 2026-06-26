export interface Seeker {
  id: string;
  userId?: string;
  name: string;
  bio: string;
  location: string;
  province?: string;
  rate: string;
  portfolio: { type: 'image' | 'video'; url: string }[];
}

export interface Contact {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  province?: string;
  location?: string;
  picture?: string;
  createdAt?: string;
}

export interface Message {
  id: number;
  userId?: string;
  text: string;
  sender: 'user' | 'contact';
  liked: boolean;
  reactions: string[];
  contactId: string;
  fileUrl?: string;
  fileType?: string;
  createdAt?: string;
}

export interface MarketItem {
  id: string;
  name: string;
  description: string;
  price: number;
  portfolio: { type: 'image' | 'video'; url: string }[];
  type: 'sale' | 'wanted';
  province?: string;
  location?: string;
  ownerId?: string;
  ownerName?: string;
  interestedCount?: number;
  appliedCount?: number;
}

export interface Gig {
  id: string;
  title: string;
  description: string;
  price: string;
  province?: string;
  location?: string;
  category?: string;
  ownerId?: string;
  ownerName?: string;
  ownerAvatar?: string;
  media?: { type: 'image' | 'video'; url: string }[];
  interestedCount?: number;
  appliedCount?: number;
}

export interface Transaction {
  id: string;
  userId?: string;
  type: 'sent' | 'received';
  amount: number;
  recipient: string;
  date: string;
}

export interface ProofOfPayment {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  documentUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

