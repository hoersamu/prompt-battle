<script setup lang="ts">
defineProps<{ images: string[]; index?: number }>();
</script>

<template>
  <div
    :class="[
      'presenter-image-gallery__wrapper',
      { 'presenter-image-gallery__wrapper--active': index !== undefined },
    ]"
  >
    <template v-if="index !== undefined">
      <img class="presenter-image-gallery__image" :src="images[index]" />
    </template>
    <template v-else>
      <img
        v-for="img in images"
        class="presenter-image-gallery__image"
        :key="img"
        :src="img"
      />
    </template>
  </div>
</template>

<style>
.presenter-image-gallery__wrapper {
  max-height: 100%;
  max-width: 100%;

  height: 100%;
  width: 100%;
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  align-items: center;
  padding: 1rem;
}

.presenter-image-gallery__wrapper--active {
  grid-template-columns: repeat(1, minmax(0, 1fr));
  grid-template-rows: repeat(1, minmax(0, 1fr));
}

.presenter-image-gallery__image {
  height: 100%;
  width: 100%;

  object-fit: contain;
  padding: 0.5rem;
  background-color: hsla(0, 0%, 100%, 0.5);
  border-radius: 0.5rem;
  border: 3px solid #000;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
}
</style>
