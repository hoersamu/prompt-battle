<script setup lang="ts">
import { PresenterState } from "../config/presenter";

const route = useRoute();

const room = route.query.room?.toString() ?? "";

if (!room) {
  console.log("no room", room);
  await navigateTo("/");
}

const { formattedTimeLeft, startCountdown } = useCountdown();

const onRoundStart = ()=> {
  startCountdown(30);
}


const { players } = usePresenterView(room, onRoundStart);


definePageMeta({
  middleware: ['check-room'],
});
</script>

<template>
  <div class="presenter__wrapper">
    <div class="presenter__header">
      <p>Round 1 - {{ formattedTimeLeft }}</p>
    </div>
    <div
      :class="{
        'presenter__wrapper-players': true,
        'presenter__wrapper-players--duell': Object.keys(players).length <= 2,
      }"
    >
      <PresenterUserWindow
        v-for="(player, id) in players"
        :key="`player-${id}`"
        :player="player"
        :player-count="Object.keys(players).length"
        :card-id="id"
        :state="PresenterState.Typing"
      />
    </div>
  </div>
</template>

<style>
html {
  overscroll-behavior: none;
}
body {
  background: hsl(0, 0%, 98%);
}
</style>

<style scoped>
.presenter__wrapper {
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
