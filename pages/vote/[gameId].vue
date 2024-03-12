<script setup lang="ts">
import { useVotes } from "@/composables/useVotes";
import { GAME_STATES } from "@/config/gameStates";

const { handleLoginOrSignUp } = useAnonymousAuth();

const gameId = useGameId();
const { activePlayers } = await usePlayersByGame(gameId);
const { game } = await useGame(gameId);
const { addVote } = useVotes(gameId);

const votedFor = ref<string | null>(null);

async function vote(playerId: string) {
  votedFor.value = playerId;
  await addVote(playerId);
}

await handleLoginOrSignUp();
</script>

<template>
  <div class="voting">
    <h1>Vote</h1>
    <div v-if="game?.state === GAME_STATES.VOTING" class="voting__player-wrapper">
      <button
        v-for="player in activePlayers" :key="player.player_id" class="voting__player"
        :class="{ 'voting__player--active': player.player_id === votedFor }" @click="() => vote(player.player_id)"
      >
        {{ player.username }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.voting {
  font-size: 1.5rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 100%;
  height: 100%;
  gap: 20px;

  h1 {
    margin: 0px;
  }

  &__player-wrapper {
    width: 100%;
    height: 100%;
  }

  &__player {
    width: 100%;
    height: 20%;
    border-radius: 0.5rem;
    border: 4px solid #000;
    font-size: 3rem;

    &:nth-child(1) {
      background: var(--color-bg-pastell-1);
    }

    &:nth-child(2) {
      background: var(--color-bg-pastell-2);
    }

    &:nth-child(3) {
      background: var(--color-bg-pastell-3);
    }

    &:nth-child(4) {
      background: var(--color-bg-pastell-4);
    }
  }
}
</style>
