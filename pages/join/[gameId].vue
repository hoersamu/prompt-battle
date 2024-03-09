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
  <div class="join-view">
    <h1>Join Game {{ gameId }}</h1>
    <PlayerNameInput v-model="nameRef" @submit="onSubmit" />
  </div>
</template>

<style scoped lang="scss">
.join-view {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
