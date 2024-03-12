export function useVotes(gameId: number) {
  const client = useTypedSupabaseClient();
  const user = useSupabaseUser();

  const addVote = async (voteForPlayerId: string) => {
    if (!user.value)
      return;

    const data = await client.from("votes").update({ voted_for: voteForPlayerId }).eq("game_id", gameId).eq("user_id", user.value.id).select();
    if (!data.data?.length)
      await client.from("votes").insert({ game_id: gameId, voted_for: voteForPlayerId, user_id: user.value.id });
  };

  const deleteAllVotes = async () => {
    return await client.from("votes").delete().eq("game_id", gameId);
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
