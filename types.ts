
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