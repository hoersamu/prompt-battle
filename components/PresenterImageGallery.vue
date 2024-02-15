<template>
  <div class="presenter-image-gallery__images">
    <img
      class="presenter-image-gallery__image"
      src="https://images.pexels.com/photos/9754/mountains-clouds-forest-fog.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    />
    <img
      class="presenter-image-gallery__image"
      src="https://images.pexels.com/photos/9754/mountains-clouds-forest-fog.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    />
    <img
      class="presenter-image-gallery__image"
      src="https://images.pexels.com/photos/9754/mountains-clouds-forest-fog.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    />
    <img
      class="presenter-image-gallery__image"
      src="https://images.pexels.com/photos/3030647/pexels-photo-3030647.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    />
  </div>
</template>

<style>
.presenter-image-gallery__images {
  max-height: 100%;
  max-width: 100%;
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, minmax(0, 1fr));
  align-items: center;
  padding: 1rem;
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
