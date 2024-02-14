<script setup lang="ts">
import { PresenterState } from "../config/presenter";

const route = useRoute();

const room = route.query.room?.toString() ?? '';

if (!room) {
  console.log('no room', room)
  await navigateTo('/');
}

const { players } = usePresenterView('2');
</script>

<template>
  <div class="presenter__wrapper">
    <PresenterUserWindow
      v-for="(player, index) in players"
      :key="`player-${index}`"
      :player="player"
      :state="PresenterState.Typing"
    />
  </div>
</template>

<style>
html {
  overscroll-behavior: none;
}
body {
  background: #000;
}
</style>

<style scoped>
.presenter__wrapper {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
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
