<script setup lang="ts">
const name = useUsername();
const gameId = useGameId();
const router = useRouter();

const { getGameById } = useGames();

const game = await getGameById(gameId);

if (game === undefined)
  router.push("/");

const nameRef = ref(name.value);

function onSubmit() {
  if (nameRef.value !== "") {
    name.value = nameRef.value;
    navigateTo(`/play/${gameId}`);
  }
}
</script>

<template>
  <div
    v-if="game"
    class="join-view"
  >
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
