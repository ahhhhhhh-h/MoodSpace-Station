export type Visibility = 'private' | 'friends' | 'broadcast';
export type EmotionType = 'positive' | 'negative' | 'received';

export interface CelestialBody {
  id: string;
  type: EmotionType;
  content: string;
  timestamp: number;
  isStarred: boolean;
  visibility: Visibility;
  sender?: string;
}

export interface Flower {
  id: string;
  style: 'style1' | 'style2' | 'style3';
  position: {
    x: number;
    y: number;
  };
} 