import { GAME_STATES } from "@/config/gameStates";
import { PLAYER_STATES } from "@/config/players";

type MaybeString = string | null | undefined;

export function showViolation(gameState: MaybeString, playerState: MaybeString) {
  return (gameState === GAME_STATES.WAITING || gameState === GAME_STATES.VOTING) && playerState === PLAYER_STATES.TOS_VIOLATION;
}
export function showGallery(gameState: MaybeString, playerState: MaybeString) {
  return (gameState === GAME_STATES.WAITING || gameState === GAME_STATES.VOTING) && (playerState === PLAYER_STATES.IMAGE_SELECTED || playerState === PLAYER_STATES.IMAGE_SELECTION);
}
