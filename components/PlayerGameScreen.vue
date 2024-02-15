<script setup lang="ts">
import { PLAYER_STATES } from '@/config/players';

const { state, time, timeLimit } = defineProps<{
  state: PLAYER_STATES;
  time: number;
  timeLimit: number;
}>();

const prompt = defineModel<string>();

const textAreaDisabled = computed(() => state !== PLAYER_STATES.PLAYING);

</script>

<template>
  <div class="player-game-screen">
  <Timer :time-left="time" :time-limit="timeLimit"></Timer>
    <textarea v-model="prompt" :disabled="textAreaDisabled" />
  </div>
</template>

<style scoped lang="scss">
.player-game-screen {
  height: 100%;
  background-color: #575a5f;
}
</style>
