<script setup lang="ts">
import { PLAYER_STATES } from '@/config/players';
import { useStorage } from '@vueuse/core';

const route = useRoute();

const room = route.query.room?.toString() ?? '';

const name = useStorage(room, '');
const prompt = ref('');
const selectedImage = ref<number>();

const { joinRoom, state, timeLeft, timeLimit, images, selectImage } = usePlayerView(prompt);

const join = async () => {
  await joinRoom(room, name.value);
}

const showPlayerGameScreen = computed(() => [
  PLAYER_STATES.READY,
  PLAYER_STATES.PLAYING,
  PLAYER_STATES.WAITING
].includes(state.value));

const showImageSelection = computed(() => [
  PLAYER_STATES.IMAGE_SELECTED,
  PLAYER_STATES.IMAGE_SELECTION,
].includes(state.value));

onBeforeMount(() => {
  if (name.value) {
    join();
  }
});

const onImageSelected = (index: number) => {
  selectedImage.value = index;
  selectImage(index);
};

definePageMeta({
  middleware: ['check-room'],
});
</script>

<template>
  <div class="player-view">
    <PlayerNameInput v-model="name" @submit.once="join" v-if="state === PLAYER_STATES.NAME_INPUT" />
    <PlayerGameScreen v-if="showPlayerGameScreen" :state="state" v-model="prompt" :time="timeLeft"
      :time-limit="timeLimit" />
    <PresenterImageGallery v-if="showImageSelection" :images="images" @select-image="onImageSelected" interactive :index="selectedImage" />
  </div>
</template>

<style scoped lang="scss">
.player-view {
  height: 100%;
  background-color: #575a5f;
}
</style>
