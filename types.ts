
export enum AppView {
  Discovery,
  Likes,
  Matches,
  Profile,
  Events,
}

export interface UserProfile {
  id: number;
  name: string;
  age: number;
  bio: string;
  interests: string[];
  photos: string[];
  distance: number;
  flowerBalance?: number;
}

export interface EventAttendee {
  id: number;
  name: string;
  avatar: string;
}

export interface AppEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  creationDate?: string;
  location: string;
  image: string;
  attendees: EventAttendee[];
  createdBy: string;
  joiningFee?: number;
}

export interface Message {
  id: number;
  text: string;
  senderId: number; // 99 for current user
  timestamp: string;
  type?: 'text' | 'gift';
  giftAmount?: number;
}

export interface Match {
  id: number;
  name: string;
  avatar: string;
  unread: number;
  messages: Message[];
  flowerBalance?: number;
}

export interface FlowerTransaction {
  id: number;
  recipientName: string;
  recipientAvatar: string;
  amount: number;
  date: string;
}