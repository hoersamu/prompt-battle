import type { Player } from "@/types/players";

export function usePlayers() {
  const client = useTypedSupabaseClient();
  const user = useSupabaseUser();

  const createError = (message: string) => {
    return {
      error: message,
      data: undefined,
    };
  };

  const getUsersForGame = async (gameId: number) => {
    if (!user.value)
      return createError("User not logged in");

    return client.from("players").select().eq("game_id", gameId);
  };

  const createUser = async (gameId: number, userId: string) => {
    if (!user.value)
      return createError("User not logged in");

    return client.from("players").insert({
      game_id: gameId,
      player_id: userId,
    }).select();
  };

  const updateUser = async (id: number, data: Partial<Player>) => {
    if (!user.value)
      return createError("User not logged in");

    return client.from("games").update(data).eq("id", id).select();
  };

  const getUserByPlayerAndGameId = async (gameId: number, playerId: string) => {
    return client.from("players").select().eq("game_id", gameId).eq("player_id", playerId).then(res => res.data?.[0]);
  };

  return {
    updateUser,
    getUserByPlayerAndGameId,
    createUser,
    getUsersForGame,
  };
}
