<script setup lang="ts">
import { useCssVar } from "@vueuse/core";

const backgroundColor = useCssVar(`--color-bg-pastell-${getRandomInteger(5, 1)}`);
</script>

<template>
  <div class="presenter-user-window__wrapper">
    <p class="presenter-user-window__name">
      <slot name="name" />
    </p>
    <slot />
  </div>
</template>

<style scoped lang="scss">
.presenter-user-window {
  &__wrapper {
    background: v-bind("backgroundColor");
    color: black;

    display: grid;
    grid-auto-flow: row;
    grid-auto-rows: min-content;
    justify-items: center;
    align-items: center;
    align-content: center;

    grid-template-rows: min-content minmax(0, 1fr);
    gap: 0;

    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
      rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    border-radius: 0.5rem;
    border: 4px solid #000;
  }

  &__name {
    font-size: 1.5rem;
    font-weight: bold;
    width: 100%;
    text-align: center;
    background: hsla(0, 0%, 100%, 0.5);
    margin: 0;
    padding: 0.5rem 0;
    border-bottom: 4px solid #000;
  }
}
</style>
