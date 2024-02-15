<script setup lang="ts">
import { PLAYER_STATES } from '@/config/players';
import { useStorage } from '@vueuse/core';

const route = useRoute();

const room = route.query.room?.toString() ?? '';

const name = useStorage(room, '');
const prompt = ref('');

const { joinRoom, state, timeLeft, timeLimit, images, selectImage } = usePlayerView(prompt);

const join = async () => {
  await joinRoom(room, name.value);
}

const showPlayerGameScreen = computed(() => [
  PLAYER_STATES.READY,
  PLAYER_STATES.PLAYING,
  PLAYER_STATES.WAITING
].includes(state.value));

onBeforeMount(() => {
  if (name.value) {
    join();
  }
});

definePageMeta({
  middleware: ['check-room'],
});
</script>

<template>
  <div class="player-view">
    <PlayerNameInput v-model="name" @submit.once="join" v-if="state === PLAYER_STATES.NAME_INPUT" />
    <PlayerGameScreen v-if="showPlayerGameScreen" :state="state" v-model="prompt" :time="timeLeft"
      :time-limit="timeLimit" />
    <PlayerImageSelection v-if="state === PLAYER_STATES.IMAGE_SELECTION" :images="images" @select-image="selectImage" />
  </div>
</template>

<style scoped lang="scss">
.player-view {
  height: 100%;
  background-color: #575a5f;
}
</style>
