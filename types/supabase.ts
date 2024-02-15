export interface PlayerPresence {
  name: string;
  id: string;
}

interface GenericEvent {
  event: string;
  type: "broadcast";
}

export interface PromptEvent extends GenericEvent {
  payload: {
    playerId: string;
    prompt: string;
  }
}

export interface ImageSelectEvent extends GenericEvent {
  payload: {
    playerId: string;
    imageIndex: number;
  }
}

export interface ImagesReadyEvent extends GenericEvent {
  payload: {
    images: string[];
  }
}

export interface GameStartEvent extends GenericEvent {
  payload: {
    timeLimit: number;
  }
}