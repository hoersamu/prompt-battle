<script setup lang="ts">
const emit = defineEmits<{
  submit: []
}>();

const name = defineModel<string>();
</script>

<template>
  <div class="player-name">
    <input v-model="name" class="player-name__input" autofocus>
    <button class="player-name__button" @click="emit('submit')">
      Play
    </button>
  </div>
</template>

<style scoped lang="scss">
.player-name{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 40px;
  height: 100%;

  &__input {
    outline: 0;
    border-width: 0 0 2px;
    border-color: #00a4e0;
    background-color: transparent;
    font-size: 40px;
    text-align: center;
  }

  &__button {
    border: none;
    background-color: #00a4e0;
    border-radius: 8px;
    width: 100px;
    height: 40px;
    color: #f8fafa;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 20px;

    &:hover {
      background-image: linear-gradient(rgb(0 0 0/10%) 0 0);
    }
  }
}
</style>
