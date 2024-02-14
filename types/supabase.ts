export interface PlayerPresence {
  name: string;
  id: string;
}

export interface PromptEvent {
  event: string;
  type: "broadcast";
  payload: {
    playerId: string;
    prompt: string;
  }
}