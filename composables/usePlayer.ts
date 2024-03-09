import {
  REALTIME_LISTEN_TYPES,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
  type RealtimeChannel,
} from "@supabase/supabase-js";
import type {
  Player,
  PlayerInsertPayload,
  PlayerUpdatePayload,
} from "@/types/players";

export async function usePlayer(gameId: number, playerId: string) {
  const client = useTypedSupabaseClient();

  const { getUserByPlayerAndGameId } = usePlayers();

  const player = ref<Player>();

  async function loadPlayer() {
    const data = await getUserByPlayerAndGameId(gameId, playerId);

    if (!data) {
      Logger.error("Game not found");
      return await navigateTo("/");
    }

    player.value = data;
  }

  const callback = ref<(payload: PlayerUpdatePayload | PlayerInsertPayload) => void>();

  const onPlayerChange = (payload: PlayerUpdatePayload | PlayerInsertPayload) => {
    if (payload.new.game_id !== gameId)
      return;

    if (callback.value)
      callback.value(payload);

    player.value = payload.new;
  };

  const playerChannel = ref<RealtimeChannel>();

  const createPlayerChangeChannel = () => {
    return client
      .channel("player-changes")
      .on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        {
          event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE,
          schema: "public",
          table: "players",
          filter: `player_id=eq.${playerId}`,
        },
        onPlayerChange,
      ).on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        {
          event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT,
          schema: "public",
          table: "players",
          filter: `player_id=eq.${playerId}`,
        },
        onPlayerChange,
      )
      .subscribe();
  };

  const registerCallback = (cb: (payload: PlayerUpdatePayload | PlayerInsertPayload) => void) => {
    callback.value = cb;
  };

  onMounted(() => {
    playerChannel.value = createPlayerChangeChannel();
  });
  onBeforeUnmount(() => {
    playerChannel.value?.unsubscribe();
  });

  await loadPlayer();

  return {
    registerCallback,
    player,
  };
}
