<script setup lang="ts">
import { useCssVar } from "@vueuse/core";
import {
  PresenterState,
  getPresenterLayout,
  getPresenterLayoutText,
} from "@/config/presenter";
import type { Player } from "@/types";

const { player, cardId } = defineProps<{
  player: Player
  cardId: string
}>();

const backgroundColor = useCssVar(`--color-bg-pastell-${cardId}`);

const dataLayoutName = computed(() =>
  getPresenterLayoutText(getPresenterLayout(player.state)),
);
</script>

<template>
  <div class="presenter-user-window__wrapper" :data-layout="dataLayoutName">
    <p class="presenter-user-window__name">
      {{ player.name }}
    </p>
    <p
      v-if="player.state === PresenterState.Overview"
      class="presenter-user-window__points"
    >
      3
    </p>
    <p
      v-if="player.state === PresenterState.Typing"
      class="presenter-user-window__text"
    >
      {{ player.prompt }}
      <span class="presenter-user-window__caret">_</span>
    </p>
    <ToSViolation
      v-if="player.state === PresenterState.Error"
    />
    <PresenterImageGallery
      v-if="
        player.state === PresenterState.ImageSelection
          || player.state === PresenterState.ImageSelected
      "
      :images="player.images"
      :selected-image="player.selectedImage"
    />
  </div>
</template>

<style scoped>
.presenter-user-window__wrapper {
  background: v-bind("backgroundColor");
  color: black;

  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: min-content;
  justify-items: center;
  align-items: center;
  align-content: center;

  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  border-radius: 0.5rem;
  border: 4px solid #000;
}

.presenter-user-window__wrapper[data-layout="large-content"] {
  grid-template-rows: min-content minmax(0, 1fr);
  gap: 0;
}

.presenter-user-window__name {
  font-size: 1.5rem;
  font-weight: bold;
  width: 100%;
  text-align: center;
  background: hsla(0, 0%, 100%, 0.5);
  margin: 0;
  padding: 0.5rem 0;
  border-bottom: 4px solid #000;
}

.presenter-user-window__wrapper[data-layout="normal"]
  .presenter-user-window__name {
  font-size: 4rem;
  background: none;
  width: auto;
  border: none;
}

.presenter-user-window__points {
  font-size: 6rem;
  margin: 0;
}

.presenter-user-window__text {
  padding: 1.5rem;

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
.presenter-user-window__error {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
