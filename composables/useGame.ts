import type { RealtimeChannel } from "@supabase/supabase-js";
import { useTypedSupabaseClient } from "./useTypedSupabaseClient";
import type {
  Game,
  GameUpdatePayload,
} from "@/types";

export async function useGame(gameId: number) {
  const client = useTypedSupabaseClient();

  const { getGameById } = useGames();

  const game = ref<Game>();

  async function loadGame() {
    const data = await getGameById(gameId);

    if (!data) {
      Logger.error("Game not found");
      return await navigateTo("/");
    }

    game.value = data;
  }

  const callback = ref<(payload: GameUpdatePayload) => void>();

  const onGameUpdate = (payload: GameUpdatePayload) => {
    if (callback.value)
      callback.value(payload);

    game.value = payload.new;
  };

  const gameChannel = ref<RealtimeChannel>();

  /**
   * IMPORTANT: Remember to unsubscribe from the listener when the component is unmounted
   */
  const createGameChangeChannel = (
    id: number,
  ) => {
    return client
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "games",
          filter: `id=eq.${id}`,
        },
        onGameUpdate,
      )
      .subscribe();
  };

  const registerCallback = (cb: (payload: GameUpdatePayload) => void) => {
    callback.value = cb;
  };

  onMounted(() => {
    gameChannel.value = createGameChangeChannel(gameId);
  });
  onBeforeUnmount(() => {
    gameChannel.value?.unsubscribe();
  });

  await loadGame();

  return {
    registerCallback,
    game,
  };
}
