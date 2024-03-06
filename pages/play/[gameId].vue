<script setup lang="ts">
import { GAME_STATES } from "@/config/gameStates";
import type { GameUpdatePayload } from "@/types";

const gameId = useGameId();
const username = useUsername();

nextTick(async () => {
  if (!username.value)
    navigateTo("/");
});

const {
  game,
  registerCallback,
} = await useGame(gameId);
const { handleLoginOrSignUp } = useAnonymousAuth();
await handleLoginOrSignUp();

const {
  formattedTimeLeft,
  startCountdown,
  formatTime,
} = useCountdown();

const prompt = ref("");
const inputRef = ref<HTMLTextAreaElement>();
const settings = computed(() => getSettings(game.value?.settings));
const gameState = computed(() => game.value?.state ?? GAME_STATES.READY);

function onGameChange(payload: GameUpdatePayload) {
  // if (game.value?.state !== payload.new.state) {
  Logger.log("Game state changed", payload.new);
  if (payload.new.state === GAME_STATES.PLAYING) {
    startCountdown(settings.value.timeLimit);
    inputRef.value?.focus();
  }
  // }
}
registerCallback(onGameChange);
</script>

<template>
  <div class="player-view">
    <div>{{ game?.instruction }}</div>
    <div>{{ gameState }}</div>
    <PlayerWindow class="player-view__game-screen">
      <template #name>
        <ClientOnly>
          {{ username }} - {{ gameState === GAME_STATES.PLAYING ? formattedTimeLeft : formatTime(settings.timeLimit) }}
        </ClientOnly>
      </template>
      <textarea
        ref="inputRef"
        v-model="prompt"
        class="player-view__input"
        autofocus
        placeholder="Your prompt goes here"
        :disabled="game?.state !== GAME_STATES.PLAYING"
      />
    </PlayerWindow>
  </div>
</template>

<style scoped lang="scss">
.player-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;

  &__game-screen {
    flex: 1;
  }

  &__input {
    resize: none;
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 2rem;
    padding: 20px;
  }
}

.test {
  height: 100px;
}
</style>
