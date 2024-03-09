<script setup lang="ts">
const name = useUsername();
const gameId = useGameId();

const { getGameById } = useGames();

const game = await getGameById(gameId);

if (game === undefined)
  await navigateTo("/");

const nameRef = ref(name.value);

function onSubmit() {
  console.log("submit");
  if (nameRef.value !== "") {
    name.value = nameRef.value;
    navigateTo(`/play/${gameId}`);
  }
}
</script>

<template>
  <CardPage v-if="game" :heading="`Join Game ${gameId}`">
    <PlayerNameInput v-model="nameRef" @submit="onSubmit" />
  </CardPage>
</template>

<style scoped lang="scss">

</style>
