<script setup lang="ts">
const { createGame: createGameEntry, getGamesForUser } = useGames();

const router = useRouter();

const user = useSupabaseUser();

// This is only triggered if the authentication fails
if (!user.value)
  await router.push("/");

const { data: games, error } = await getGamesForUser();

if (error)
  Logger.error(error);

async function createGame() {
  const newGame = await createGameEntry();

  if (newGame.error || !newGame.data)
    return Logger.error(newGame.error);

  router.push(`/admin/${newGame.data[0].id}`);
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
