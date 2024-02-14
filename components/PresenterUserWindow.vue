<script setup lang="ts">
import { PresenterState, getPresenterStateText } from "@/config/presenter";

const { name, points, state } = defineProps<{
  name: string;
  points?: number;
  text?: string;
  state: PresenterState;
}>();

let dataStateName = getPresenterStateText(state);
</script>

<template>
  <div class="presenter-user-window__wrapper" :data-state="dataStateName">
    <p class="presenter-user-window__name">
      {{ name }}
    </p>
    <p
      v-if="state === PresenterState.Waiting && points"
      class="presenter-user-window__subheading"
    >
      {{ points }}
    </p>
    <p
      v-if="state === PresenterState.Typing"
      class="presenter-user-window__text"
    >
      {{ text }}
      <span class="presenter-user-window__caret">_</span>
    </p>
  </div>
</template>

<style scoped>
.presenter-user-window__wrapper {
  padding: 1.5rem;
  color: black;

  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: min-content;
  justify-items: center;
  align-items: center;
  align-content: center;
  width: 50%;
  min-height: 50%;
}
.presenter-user-window__wrapper[data-state="typing"] {
  grid-template-rows: min-content 1fr;
}

.presenter-user-window__name {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
}

.presenter-user-window__wrapper[data-state="waiting"]
  .presenter-user-window__name {
  font-size: 4rem;
}

.presenter-user-window__subheading {
  font-size: 3rem;
  margin: 0;
}

.presenter-user-window__text {
  margin: 1.5rem;
  height: 1fr;
}

@keyframes blinking {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.presenter-user-window__caret {
  animation-name: blinking;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  animation-timing-function: steps(2, jump-none);
}
</style>
