import type { PLAYER_STATES } from '@/config/players';

export interface Player {
  name: string;
  prompt: string;
  state: PLAYER_STATES;
  images: string[];
  selectedImage: number;
}