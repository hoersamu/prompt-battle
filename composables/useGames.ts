import type { Game } from "@/types/game";
import type { Database } from "@/types/database.types";

export function useGames() {
  const client = useTypedSupabaseClient();
  const user = useSupabaseUser();

  const createError = (message: string) => {
    return {
      error: message,
      data: undefined,
    };
  };

  const getGamesForUser = async () => {
    if (!user.value)
      return createError("User not logged in");

    return client.from("games").select().eq("author", user.value.id);
  };

  const createGame = async () => {
    if (!user.value)
      return createError("User not logged in");

    return client.from("games").insert({
      author: user.value.id,
      settings: {},
    }).select();
  };

  const updateGame = async (id: number, data: Partial<Omit<Game, "id">>) => {
    if (!user.value)
      return createError("User not logged in");

    return client.from("games").update(data).eq("id", id).select();
  };

  const getGameById = async (id: number) => {
    return client.from("games").select().eq("id", id).then(res => res.data?.[0]);
  };

  return {
    updateGame,
    getGameById,
    createGame,
    getGamesForUser,
  };
}
