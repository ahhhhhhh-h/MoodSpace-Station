export type Visibility = 'private' | 'friends' | 'broadcast';
export type EmotionType = 'positive' | 'negative' | 'received';
export type FlowerStyle = 'flower1' | 'flower2' | 'flower3';

export interface CelestialBody {
  id: string;
  type: EmotionType;
  content: string;
  timestamp: number;
  isStarred: boolean;
  visibility: Visibility;
  isNew?: boolean;
  sender?: string;
  isExternal?: boolean;
  replies: Set<string>;
}

export interface Flower {
  id: string;
  position: {
    x: number;
    y: number;
  };
  style: 'flower1' | 'flower2' | 'flower3';
} 