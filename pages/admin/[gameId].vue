<script setup lang="ts">
import { GAME_STATES } from "@/config/gameStates";

const gameId = useGameId();

const { startRound } = useAdminView(gameId.toString());
const { startCountdown } = useCountdown();

const { updateGame, getGameById } = useGames();
const instructionInput = ref("");
const {
  instructions,
  getInstructionsForGame,
  createInstruction,
  deleteInstruction,
} = useInstructions(gameId);

const game = await getGameById(gameId);
const settings = getSettings(game?.settings);

async function start(instruction: string) {
  await updateGame(gameId, { state: GAME_STATES.PLAYING, instruction, settings: { timeLimit: 10 } });
  startCountdown(10, () => {
    updateGame(gameId, { state: GAME_STATES.WAITING, instruction: "" });
  });
  startRound();
}

async function sendInstruction(instruction: string) {
  await updateGame(gameId, { state: GAME_STATES.WAITING, instruction });
}

async function reset() {
  await updateGame(gameId, { state: GAME_STATES.WAITING, instruction: "" });
}

await getInstructionsForGame();
</script>

<template>
  <div class="admin-view">
    <h1>Admin</h1>
    <button @click="reset">
      Reset
    </button>
    <div v-for="[name, value] in Object.entries(settings)" :key="name">
      {{ name }}: {{ value }}
    </div>
    <form @submit.prevent="() => createInstruction(instructionInput)">
      <input v-model="instructionInput">
      <button type="submit">
        Add Instruction
      </button>
    </form>
    <table>
      <thead>
        <tr>
          <th>instruction</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="instruction in instructions" :key="instruction.id">
          <td>{{ instruction.instruction }}</td>
          <td>
            <button
              title="Send instruction without starting round"
              @click="() => sendInstruction(instruction.instruction)"
            >
              <Icon name="fluent:send-28-filled" />
            </button>
            <button
              title="Start round with this instruction"
              @click="() => start(instruction.instruction)"
            >
              <Icon name="fluent:play-28-filled" />
            </button>
            <button
              title="Delete instruction"
              @click="() => deleteInstruction(instruction.id)"
            >
              <Icon name="fluent:delete-28-filled" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.admin-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
