
export enum AppView {
  Discovery,
  Likes,
  Matches,
  Profile,
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
