import { REALTIME_LISTEN_TYPES, REALTIME_POSTGRES_CHANGES_LISTEN_EVENT, type RealtimeChannel, type RealtimePostgresDeletePayload } from "@supabase/supabase-js";
import type { Player, PlayerDeletePayload, PlayerInsertPayload, PlayerUpdatePayload } from "@/types/players";

export async function usePlayersByGame(gameId: number) {
  const client = useTypedSupabaseClient();
  const { getUsersByGameId } = usePlayers();

  const players = ref<Record<string, Player>>({});

  const loadPlayers = async () => {
    const { data } = await getUsersByGameId(gameId);

    if (!data)
      return Logger.error("Game not found");

    players.value = data.reduce((acc, player) => {
      acc[player.player_id] = player;
      return acc;
    }, {} as Record<string, Player>);
  };

  const onPlayerUpsert = (payload: PlayerUpdatePayload | PlayerInsertPayload) => {
    players.value[payload.new.player_id] = payload.new;
  };

  const onPlayerDelete = (payload: PlayerDeletePayload) => {
    if (payload.old.game_id === gameId && payload.old.player_id)
      delete players.value[payload.old.player_id];
  };

  const playersChannel = ref<RealtimeChannel>();

  const createPlayerChangeChannel = () => {
    return client
      .channel("schema-db-changes")
      .on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        {
          event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE,
          schema: "public",
          table: "players",
          filter: `game_id=eq.${gameId}`,
        },
        onPlayerUpsert,
      )
      .on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        {
          event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT,
          schema: "public",
          table: "players",
          filter: `game_id=eq.${gameId}`,
        },
        onPlayerUpsert,
      )
      .on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        {
          event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE,
          schema: "public",
          table: "players",
        },
        onPlayerDelete,
      )
      .subscribe();
  };

  onMounted(() => {
    playersChannel.value = createPlayerChangeChannel();
  });
  onBeforeUnmount(() => {
    playersChannel.value?.unsubscribe();
  });

  await loadPlayers();

  return { players };
}
