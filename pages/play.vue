<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { PLAYER_STATES } from "@/config/players";

const route = useRoute();

const room = route.query.room?.toString() ?? "";

const name = useStorage(room, "");
const prompt = ref("");
const selectedImage = ref<number>();

const { joinRoom, state, timeLeft, timeLimit, images, selectImage } = usePlayerView(prompt);

async function join() {
  await joinRoom(room, name.value);
}

const showPlayerGameScreen = computed(() => [
  PLAYER_STATES.READY,
  PLAYER_STATES.PLAYING,
  PLAYER_STATES.WAITING,
].includes(state.value));

const showImageSelection = computed(() => [
  PLAYER_STATES.IMAGE_SELECTED,
  PLAYER_STATES.IMAGE_SELECTION,
].includes(state.value));

onBeforeMount(() => {
  if (name.value)
    join();
});

function onImageSelected(index: number) {
  selectedImage.value = index;
  selectImage(index);
}

definePageMeta({
  middleware: ["check-room"],
});
</script>

<template>
  <div class="player-view">
    <PlayerNameInput v-if="state === PLAYER_STATES.NAME_INPUT" v-model="name" @submit.once="join" />
    <PlayerGameScreen
      v-if="showPlayerGameScreen" v-model="prompt" :state="state" :time="timeLeft"
      :time-limit="timeLimit"
    />
    <PresenterImageGallery v-if="showImageSelection" :images="images" interactive :selected-image="selectedImage" @select-image="onImageSelected" />
    <ToSViolation v-if="state === PLAYER_STATES.TOS_VIOLATION" />
  </div>
</template>

<style scoped lang="scss">
.player-view {
  height: 100%;
  background-color: #575a5f;
}
</style>
