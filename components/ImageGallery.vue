<script setup lang="ts">
const {
  images,
  selectedImage,
} = defineProps<{
  images?: string | null
  selectedImage?: number | null
  interactive?: boolean
}>();

defineEmits<{
  selectImage: [number]
}>();

const imagePrefix = useImageBasePath();

const imageSelected = computed(() => selectedImage !== undefined && selectedImage !== null);

const imagePaths = computed(() => images ? images.split(",").map(path => `${imagePrefix}${path}`) : []);
</script>

<template>
  <div
    v-auto-animate
    class="presenter-image-gallery__wrapper"
    :class="{ 'presenter-image-gallery__wrapper--active': imageSelected }"
  >
    <template v-for="(img, index) in imagePaths">
      <img
        v-if="!imageSelected || selectedImage === index"
        :key="img" class="presenter-image-gallery__image"
        :class="[
          { 'presenter-image-gallery__image--interactive': interactive && !imageSelected },
        ]"
        :src="img"
        @click="$emit('selectImage', index)"
      >
    </template>
  </div>
</template>

<style lang="scss">
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
  width: 100%;
  aspect-ratio: 1 / 1;

  object-fit: contain;
  background-color: hsla(0, 0%, 100%, 0.5);
  border-radius: 0.5rem;
  border: 3px solid #000;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;

  &--interactive {
    transition: all .2s ease-out;

    &:hover {
      transform: scale(1.02);
    }
  }
}
</style>
