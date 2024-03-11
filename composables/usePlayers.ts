import type { Player } from "@/types/players";

export function usePlayers() {
  const client = useTypedSupabaseClient();
  const user = useSupabaseUser();

  const getUsersForGame = async (gameId: number) => {
    if (!user.value)
      throw new Error("User not logged in");

    return client.from("players").select().eq("game_id", gameId);
  };

  const createOrUpdateUser = async (gameId: number, userId: string, username: string) => {
    if (!user.value)
      throw new Error("User not logged in");

    return client.from("players").upsert({
      game_id: gameId,
      player_id: userId,
      username,
      inactive: false,
    }).select();
  };

  const updateUser = async (gameId: number, playerId: string, data: Partial<Player>) => {
    if (!user.value)
      throw new Error("User not logged in");

    return client
      .from("players")
      .update(data)
      .eq("game_id", gameId)
      .eq("player_id", playerId)
      .select();
  };

  const getUserByPlayerAndGameId = async (gameId: number, playerId: string) => {
    return client.from("players").select().eq("game_id", gameId).eq("player_id", playerId).then(res => res.data?.[0]);
  };

  const getUsersByGameId = async (gameId: number) => {
    return client.from("players").select().eq("game_id", gameId);
  };

  const resetPlayersInGame = async (gameId: number) => {
    return client.from("players").update({ selected_image: null, prompt: null, images: "", state: "" }).eq("game_id", gameId);
  };

  const activateAndDeactivateMultiplePlayers = async (gameId: number, playerIds: string[]) => {
    await client.from("players").update({ inactive: false }).eq("game_id", gameId)
      .in("player_id", playerIds);
    await client.from("players").update({ inactive: true }).eq("game_id", gameId).not("player_id", "in", `(${playerIds.join(",")})`);
  };

  return {
    activateAndDeactivateMultiplePlayers,
    updateUser,
    getUserByPlayerAndGameId,
    createOrUpdateUser,
    getUsersForGame,
    getUsersByGameId,
    resetPlayersInGame,
  };
}
