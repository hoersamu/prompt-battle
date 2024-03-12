<script setup lang="ts">
import type {
  RealtimeChannel,
  RealtimePresenceJoinPayload,
  RealtimePresenceLeavePayload,
  RealtimePresenceState,
} from "@supabase/supabase-js";
import type { PresenceJoinPayload } from "../../composables/useRealtimeChannel";
import { GAME_STATES } from "@/config/gameStates";
import { PLAYER_STATES } from "@/config/players";
import type { Settings } from "@/types/settings";
import type { Json } from "@/types/database.types";

const gameId = useGameId();

const { startCountdown } = useCountdown();

const { updateGame } = useGames();
const instructionInput = ref("");
const {
  instructions,
  getInstructionsForGame,
  createInstruction,
  deleteInstruction,
} = useInstructions(gameId);
const {
  players,
  finishedPlayers,
  activePlayerCount,
} = await usePlayersByGame(gameId);
const {
  updateUser,
  resetPlayersInGame,
  activateAndDeactivateMultiplePlayers,
} = usePlayers();
const {
  generateImages,
  apiKey,
  saveKey,
} = useOpenAIImages();
const { deleteAllImages } = useSupabaseStorage();
const { game } = await useGame(gameId);

const settings = computed(() => getSettings(game.value?.settings));

const { createOrUpdateUser } = usePlayers();

async function addJoinedUser({ newPresences }: RealtimePresenceJoinPayload<PresenceJoinPayload>, channel: RealtimeChannel) {
  for (const presence of newPresences) {
    if (!(presence.id)) {
      Logger.error("Invalid user id:", presence.id);
      continue;
    }
    if (players.value[presence.id])
      continue;

    if (activePlayerCount.value >= settings.value.maxPlayers) {
      channel.send({
        type: "broadcast",
        event: "kick",
        payload: { player_id: presence.id, type: ROOM_KICK_SUBEVENT.FULL_ROOM },
      });
      continue;
    }

    Logger.log(`Adding ${presence.username} to the game`);
    createOrUpdateUser(gameId, presence.id, presence.username);
  }
}

function deactivatePlayer({ leftPresences }: RealtimePresenceLeavePayload<PresenceJoinPayload>) {
  for (const presence of leftPresences) {
    if (!presence.id) {
      Logger.error("Invalid user id:", presence.id);
      continue;
    }

    Logger.log(`Remove ${presence.username} from the game`);
    updateUser(gameId, presence.id, { inactive: true });
  }
}

function onSync(presence?: RealtimePresenceState<PresenceJoinPayload>) {
  const players = presence?.players as PresenceJoinPayload[] || [];

  const playerIds = players.map(player => player.id);

  Logger.log("Syncing players", players.map(player => player.username));

  activateAndDeactivateMultiplePlayers(gameId, playerIds);
}

useRealtimeChannel(gameId, { onJoin: addJoinedUser, onLeave: deactivatePlayer, onSync });

async function onCountdownEnd() {
  await updateGame(gameId, { state: GAME_STATES.WAITING, instruction: "" });

  const playersList = Object.values(players.value);

  for (const player of playersList) {
    if (player.prompt) {
      generateImages(player.prompt, player.player_id).then((images) => {
        updateUser(gameId, player.player_id, { images: images.join(","), state: PLAYER_STATES.IMAGE_SELECTION });
      }).catch(() => {
        updateUser(gameId, player.player_id, { state: PLAYER_STATES.TOS_VIOLATION });
      });
    }
    else {
      updateUser(gameId, player.player_id, { state: PLAYER_STATES.TOS_VIOLATION });
    }
  }
}

async function start(instruction: string) {
  await resetPlayersInGame(gameId);
  await updateGame(gameId, { state: GAME_STATES.PLAYING, instruction });
  startCountdown(settings.value.timeLimit, onCountdownEnd);
}

async function sendInstruction(instruction: string) {
  await updateGame(gameId, { state: GAME_STATES.WAITING, instruction });
}

async function reset() {
  resetPlayersInGame(gameId);
  updateGame(gameId, { state: GAME_STATES.READY, instruction: "" });
}

function saveSettings(settings: Settings) {
  updateGame(gameId, { settings: settings as unknown as Json });
}

await getInstructionsForGame();

function startVote() {
  updateGame(gameId, { state: GAME_STATES.VOTING });
}
</script>

<template>
  <div class="admin-view">
    <h1>Admin</h1>
    <button @click="reset">
      Reset
    </button>
    <button @click="() => deleteAllImages(gameId)">
      Delete all images
    </button>
    <button :disabled="!finishedPlayers || finishedPlayers !== activePlayerCount" @click="startVote">
      Start Voting
    </button>
    <div v-for="[name, value] in Object.entries(settings)" :key="name">
      {{ name }}: {{ value }}
    </div>
    <SettingsEditor :settings="settings" @submit="saveSettings" />
    <div>
      <label for="apiKey">OpenAI API Key</label>
      <input id="apiKey" v-model="apiKey">
      <label for="saveApiKey">Save API Key to Local storage</label>
      <input id="saveApiKey" v-model="saveKey" type="checkbox">
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
      <tbody v-auto-animate>
        <tr v-for="instruction in instructions" :key="instruction.id">
          <td :class="{ 'instruction--active': instruction.instruction === game?.instruction }">
            {{ instruction.instruction }}
          </td>
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

.instruction--active {
  color: green;
}
</style>
