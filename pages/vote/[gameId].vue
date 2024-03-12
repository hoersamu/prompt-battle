<script setup lang="ts">
import { useVotes } from "@/composables/useVotes";
import { GAME_STATES } from "@/config/gameStates";

const { handleLoginOrSignUp } = useAnonymousAuth();

const gameId = useGameId();
const { activePlayers } = await usePlayersByGame(gameId);
const { game } = await useGame(gameId);
const { addVote } = useVotes(gameId);

await handleLoginOrSignUp();
</script>

<template>
  <div>
    <h1>Vote</h1>
    <template v-if="game?.state === GAME_STATES.VOTING">
      <div v-for="player in activePlayers" :key="player.player_id">
        <button @click="() => addVote(player.player_id)">
          {{ player.username }}
        </button>
      </div>
    </template>
  </div>
</template>
