import {
  REALTIME_LISTEN_TYPES,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
  type RealtimeChannel,
} from "@supabase/supabase-js";
import type {
  VoteDeletePayload,
  VoteInsertPayload,
  VoteUpdatePayload,
} from "@/types/votes";

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

  const initializeVoteForPlayer = (playerId: string) => {
    if (!votes.value[playerId])
      votes.value[playerId] = 0;
  };

  const onVoteUpdate = (payload: VoteUpdatePayload) => {
    initializeVoteForPlayer(payload.new.voted_for);
    console.log(payload);
    votes.value[payload.new.voted_for] = votes.value[payload.new.voted_for] + 1;
    if (payload.old.voted_for)
      votes.value[payload.old.voted_for] = votes.value[payload.old.voted_for] - 1;
  };

  const onVoteInsert = (payload: VoteInsertPayload) => {
    console.log("insert", payload);
    initializeVoteForPlayer(payload.new.voted_for);
    votes.value[payload.new.voted_for] = votes.value[payload.new.voted_for] + 1;
  };

  const onVoteDelete = (payload: VoteDeletePayload) => {
    console.log(payload);
    if (payload.old.game_id === gameId && payload.old.voted_for)
      votes.value[payload.old.voted_for] = votes.value[payload.old.voted_for] - 1;
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
