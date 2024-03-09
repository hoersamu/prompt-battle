<script setup lang="ts">
const { createGame: createGameEntry, getGamesForUser } = useGames();

const user = useSupabaseUser();

// This is only triggered if the authentication fails
if (!user.value)
  await navigateTo("/");

const { data: games, error } = await getGamesForUser();

if (error)
  Logger.error(error);

async function createGame() {
  const newGame = await createGameEntry();

  if (newGame.error || !newGame.data)
    return Logger.error(newGame.error);

  navigateTo(`/admin/${newGame.data[0].id}`);
}
</script>

<template>
  <button @click="createGame">
    Create Game
  </button>
  <ul>
    <li v-for="game in games" :key="game.id">
      <nuxt-link :to="`/admin/${game.id}`">
        {{ game.id }}
      </nuxt-link>
    </li>
  </ul>
</template>
