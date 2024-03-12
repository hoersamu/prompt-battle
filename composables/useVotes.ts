export function useVotes(gameId: number) {
  const client = useTypedSupabaseClient();
  const user = useSupabaseUser();

  const addVote = async (voteForPlayerId: string) => {
    if (user.value)
      await client.from("votes").upsert({ game_id: gameId, voted_for: voteForPlayerId, user_id: user.value.id });
  };

  const deleteAllVotes = async () => {
    client.from("votes").delete().eq("game_id", gameId);
  };

  const getVotes = () => {
    return client.rpc("count_votes", { game_id: gameId });
  };

  return {
    getVotes,
    addVote,
    deleteAllVotes,
  };
}
