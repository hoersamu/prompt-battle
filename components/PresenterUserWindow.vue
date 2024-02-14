<script setup lang="ts">
import {
  PresenterState,
  getPresenterLayout,
  getPresenterLayoutText,
} from "@/config/presenter";
import type { Player } from '@/types';

const { player, state } = defineProps<{
  player: Player;
  state: PresenterState;
}>();

let dataLayoutName = getPresenterLayoutText(getPresenterLayout(state));
</script>

<template>
  <div class="presenter-user-window__wrapper" :data-layout="dataLayoutName">
    <p class="presenter-user-window__name">
      {{ player.name }}
    </p>
    <!-- <p
      v-if="state === PresenterState.Waiting && points"
      class="presenter-user-window__subheading"
    >
      {{ points }}
    </p> -->
    <p
      v-if="state === PresenterState.Typing"
      class="presenter-user-window__text"
    >
      {{ player.prompt }}
      <span class="presenter-user-window__caret">_</span>
    </p>
    <p
      v-if="state === PresenterState.ImageSelection"
      class="presenter-user-window__img-gallery"
    >
      <PresenterImageGallery />
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
.presenter-user-window__wrapper[data-layout="large-content"] {
  grid-template-rows: min-content 1fr;
}

.presenter-user-window__name {
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
  padding: 0 1rem;
  border-bottom: 2px solid;
}

.presenter-user-window__wrapper[data-state="normal"]
  .presenter-user-window__name {
  font-size: 4rem;
}

.presenter-user-window__subheading {
  font-size: 3rem;
  margin: 0;
}

.presenter-user-window__text {
  height: 1fr;
  width: 100%;
  margin: 1.5rem;
  text-align: center;
  overflow: hidden;
  overflow-wrap: break-word;
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
