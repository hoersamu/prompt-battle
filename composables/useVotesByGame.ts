import {
  REALTIME_LISTEN_TYPES,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
  type RealtimeChannel,
} from "@supabase/supabase-js";

export async function useVotesByGame(gameId: number) {
  const client = useTypedSupabaseClient();
  const { getVotes } = useVotes(gameId);

  const votes = ref<Record<string, number>>({});

  const loadVotes = async () => {
    const data = await getVotes();

    if (!data.data)
      return Logger.error("No players");

    votes.value = data.data.reduce((acc, voteCount) => {
      acc[voteCount.voted_for] = voteCount.count;
      return acc;
    }, {} as Record<string, number>);
  };

  const onVoteUpdate = () => {
    loadVotes();
  };

  const onVoteInsert = () => {
    loadVotes();
  };

  const onVoteDelete = () => {
    loadVotes();
  };

  const playersChannel = ref<RealtimeChannel>();

  const createVoteChangeChannel = () => {
    return client
      .channel("vote-changes")
      .on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        {
          event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.UPDATE,
          schema: "public",
          table: "votes",
          filter: `game_id=eq.${gameId}`,
        },
        onVoteUpdate,
      )
      .on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        {
          event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.INSERT,
          schema: "public",
          table: "votes",
          filter: `game_id=eq.${gameId}`,
        },
        onVoteInsert,
      )
      .on(
        REALTIME_LISTEN_TYPES.POSTGRES_CHANGES,
        {
          event: REALTIME_POSTGRES_CHANGES_LISTEN_EVENT.DELETE,
          schema: "public",
          table: "votes",
        },
        onVoteDelete,
      )
      .subscribe();
  };

  onMounted(() => {
    playersChannel.value = createVoteChangeChannel();
  });
  onBeforeUnmount(() => {
    playersChannel.value?.unsubscribe();
  });

  await loadVotes();

  return {
    votes,
  };
}
