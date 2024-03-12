<script setup lang="ts">
import { GAME_STATES } from "@/config/gameStates";
import type { GameUpdatePayload } from "@/types";

const gameId = useGameId();

const { votes } = await useVotesByGame(gameId);
const { activePlayers } = await usePlayersByGame(gameId);
const {
  game,
  registerCallback,
} = await useGame(gameId);

const {
  startCountdown,
  formatTime,
  formattedTimeLeft,
} = useCountdown();
const settings = computed(() => getSettings(game.value?.settings));
const gameState = computed(() => game.value?.state);
const time = computed(() => game.value?.state === GAME_STATES.PLAYING ? formattedTimeLeft.value : formatTime(settings.value.timeLimit));

function onGameChange(payload: GameUpdatePayload) {
  if (payload.new.state === GAME_STATES.PLAYING)
    startCountdown(settings.value.timeLimit);
}
registerCallback(onGameChange);

const shouldShouldShowPrompt = computed(() => gameState.value === GAME_STATES.PLAYING);
</script>

<template>
  <div class="presenter__wrapper">
    <div class="presenter__header">
      <p>Round 1 - {{ time }}</p>
    </div>
    <div
      class="presenter__wrapper-players"
      :class="{
        'presenter__wrapper-players--duell': activePlayers.length <= 2,
      }"
    >
      <PlayerWindow
        v-for="player in activePlayers"
        :key="player.player_id"
      >
        <template #name>
          <ClientOnly>
            {{ player.username }}
          </ClientOnly>
        </template>
        <div class="player-window">
          <div v-if="shouldShouldShowPrompt" class="prompt">
            {{ player.prompt }}
          </div>
          <ToSViolation v-else-if="showViolation(gameState, player.state)" />
          <ImageGallery
            v-else-if="showGallery(gameState, player.state)"
            :selected-image="player.selected_image"
            :images="player.images"
          />
          <div v-else />
          <div v-if="gameState === GAME_STATES.VOTING" class="voting-overlay">
            {{ votes[player.player_id] }}
          </div>
        </div>
      </PlayerWindow>
    </div>
  </div>
</template>

<style scoped lang="scss">
.player-window {
  position: relative;
}

.voting-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  color: white;
  text-shadow: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
  text-shadow: 0 0 10px black;
}

.prompt {
  width: 100%;
  overflow: hidden;
  overflow-wrap: break-word;
  padding: 10px;
  font-size: 2rem;
}

.presenter__wrapper {
  transition: all 100ms ease-out;
  height: 100%;
  display: grid;
  grid-template-rows: min-content minmax(0, 1fr);
}

.presenter__header {
  background: hsl(0, 0%, 20%);
  color: white;
  text-align: center;
  font-size: 1.75rem;
  padding: 0.75rem 0;

  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  border-radius: 0 0 0.5rem 0.5rem;
  border-bottom: 4px solid #000;
}

.presenter__header p {
  margin: 0;
}

.presenter__wrapper-players {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
  padding: 1rem;
}

.presenter__wrapper-players--duell {
  grid-template-rows: minmax(0, 1fr);
}

.presenter-user-window__wrapper:nth-child(1) {
  background: var(--color-bg-pastell-1);
}

.presenter-user-window__wrapper:nth-child(2) {
  background: var(--color-bg-pastell-2);
}

.presenter-user-window__wrapper:nth-child(3) {
  background: var(--color-bg-pastell-3);
}

.presenter-user-window__wrapper:nth-child(4) {
  background: var(--color-bg-pastell-4);
}
</style>
