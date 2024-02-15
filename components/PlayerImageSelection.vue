<script setup lang="ts">
defineProps<{
  images: string[];
}>();

defineEmits<{
  selectImage: [number]
}>();
</script>

<template>
  <div class="player-image-selection">
    <div class="player-image-selection__image-wrapper" v-for="(image, index) in images">
      <img class="player-image-selection__image" :src="image" :key="index" @click="$emit('selectImage', index)" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.player-image-selection {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  height: 100%;

  &__image-wrapper {
    padding: 20px;
  }

  &__image {
    object-fit: contain;
    width: 100%;
    height: 100%;

    &:hover {
      scale: 1.05;
    }
  }
}
</style>