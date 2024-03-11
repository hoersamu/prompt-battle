<script setup lang="ts">
import type { RealtimeChannel } from "@supabase/supabase-js";
import { ROOM_KICK_SUBEVENT } from "../../composables/useRealtimeChannel";
import { GAME_STATES } from "@/config/gameStates";
import { PLAYER_STATES } from "@/config/players";
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

const { updateUser } = usePlayers();
const user = useSupabaseUser();
const { player } = await usePlayer(gameId, user.value?.id ?? "");

function joinChannel(channel: RealtimeChannel) {
  channel.track({ username: username.value, id: user.value?.id });
}

function onKicked(payload: { payload: ROOM_KICK_PAYLOAD }) {
  if (user.value?.id !== payload.payload.player_id)
    return;

  switch (payload.payload.type) {
    case ROOM_KICK_SUBEVENT.FULL_ROOM:
      navigateTo("/play/fullgame");
      break;
    case ROOM_KICK_SUBEVENT.KICKED_FROM_ROOM:
      navigateTo("/");
      break;
  }
};

useRealtimeChannel(gameId, { onSubscribe: joinChannel, onKicked });

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
  if (payload.new.state === GAME_STATES.PLAYING) {
    startCountdown(settings.value.timeLimit);
    prompt.value = "";
    inputRef.value?.focus();
  }
}
registerCallback(onGameChange);

function selectImage(index: number) {
  if (user.value && game.value)
    updateUser(game.value?.id, user.value.id, { selected_image: index, state: PLAYER_STATES.IMAGE_SELECTED });
}

watch(prompt, () => {
  if (user.value && game.value)
    updateUser(game.value.id, user.value.id, { prompt: prompt.value });
});
</script>

<template>
  <div class="player-view">
    <template v-if="player">
      <div>{{ game?.instruction }}</div>
      <div>{{ gameState }}</div>
      <PlayerWindow class="player-view__game-screen">
        <template #name>
          <ClientOnly>
            {{ username }} - {{ gameState === GAME_STATES.PLAYING ? formattedTimeLeft : formatTime(settings.timeLimit) }}
          </ClientOnly>
        </template>
        <ToSViolation v-if="showViolation(gameState, player?.state)" />
        <ImageGallery
          v-else-if="showGallery(gameState, player?.state)"
          class="player-view__gallery"
          :images="player?.images"
          interactive
          :selected-image="player?.selected_image"
          @select-image="selectImage"
        />
        <textarea
          v-else
          ref="inputRef"
          v-model="prompt"
          class="player-view__input"
          autofocus
          placeholder="Your prompt goes here"
          :disabled="game?.state !== GAME_STATES.PLAYING"
        />
      </PlayerWindow>
    </template>
    <div v-else class="player-view__joining">
      Joining...
    </div>
  </div>
</template>

<style scoped lang="scss">
.player-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 20px;

  &__joining {
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }

  &__game-screen {
    flex: 1;
    overflow: hidden;
  }

  &__gallery {
    height: 100%;
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
