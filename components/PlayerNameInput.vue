<script setup lang="ts">
const emit = defineEmits<{
  submit: []
}>();

const name = defineModel<string>();
</script>

<template>
  <div class="player-name">
    <form @submit.prevent="emit('submit')">
      <input v-model="name" class="player-name__input" autofocus placeholder="Your name">
      <button type="submit" class="player-name__button">
        Play
      </button>
    </form>
  </div>
</template>

<style scoped lang="scss">
.player-name__input {
  width: 20rem;
  display: block;
  font-size: 1.25rem;
  text-align: center;
  margin: 0 auto;
  border-radius: 0.5rem;
  border: 4px solid #000;
  padding: 0.5rem 0.5rem;
}

.player-name__button {
  cursor: pointer;
  width: 20rem;
  display: block;
  text-align: center;
  background: hsl(0, 0%, 90%);
  margin: 1.5rem auto;
  padding: 1rem 0.5rem;
  text-decoration: none;
  color: #000;
  font-size: 1.25rem;

  border-radius: 0.5rem;
  border: 4px solid #000;

  transition: all 0.05s ease-out;

  &:hover {
    scale: 1.05;
  }
}
</style>
