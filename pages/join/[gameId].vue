<script setup lang="ts">
const name = useUsername();

const nameRef = ref(name.value);

const { params: { gameId } } = useRoute();

function onSubmit() {
  if (nameRef.value !== "") {
    name.value = nameRef.value;
    navigateTo(`/play/${gameId}`);
  }
}
</script>

<template>
  <div class="play-view">
    <h1>Join Game {{ gameId }}</h1>
    <p>Game ID: {{ gameId }}</p>
    <label for="name">Name:</label>
    <input id="name" v-model="nameRef">
    <button @click="onSubmit">
      Join Game
    </button>
  </div>
</template>
