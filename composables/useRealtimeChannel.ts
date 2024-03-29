import {
  REALTIME_LISTEN_TYPES,
  REALTIME_PRESENCE_LISTEN_EVENTS,
  REALTIME_SUBSCRIBE_STATES,
} from "@supabase/supabase-js";
import type {
  RealtimeChannel,
  RealtimePresenceJoinPayload,
  RealtimePresenceLeavePayload,
  RealtimePresenceState,
} from "@supabase/supabase-js";

export enum ROOM_KICK_EVENT { KICK = "kick" }
export enum ROOM_KICK_SUBEVENT { KICKED_FROM_ROOM = "room-kicked", FULL_ROOM = "full-room" };
export interface ROOM_KICK_PAYLOAD { player_id: string, type: ROOM_KICK_SUBEVENT };
export interface PresenceJoinPayload {
  username: string
  id: string
};

function useRealtimeSupabase() {
  const channel = ref<RealtimeChannel>();
  const joinChannel = (channelName: string) => {
    channel.value = useTypedSupabaseClient().realtime.channel(channelName, {
      config: {
        broadcast: { self: true },
        presence: { key: "players" },
      },
    });
  };

  return { joinChannel, channel };
}

export function useRealtimeChannel(gameId: number, callbacks: {
  onSync?: (presence?: RealtimePresenceState<PresenceJoinPayload>) => void
  onJoin?: (presenceJoinPayload: RealtimePresenceJoinPayload< PresenceJoinPayload>, channel: RealtimeChannel) => void
  onLeave?: (presenceLeavePayload: RealtimePresenceLeavePayload< PresenceJoinPayload>) => void
  onSubscribe?: (channel: RealtimeChannel) => void
  onKicked?: (payload: { payload: ROOM_KICK_PAYLOAD }) => void
}): Ref<RealtimeChannel | undefined> {
  const { joinChannel, channel } = useRealtimeSupabase();

  onMounted(() => {
    joinChannel(`room-${gameId}`);

    if (channel.value === undefined)
      return ref(undefined);

    if (callbacks.onSync) {
      channel.value.on(
        REALTIME_LISTEN_TYPES.PRESENCE,
        { event: REALTIME_PRESENCE_LISTEN_EVENTS.SYNC },
        () => callbacks.onSync?.(channel.value?.presenceState()),
      );
    }
    if (callbacks.onJoin) {
      channel.value.on(
        REALTIME_LISTEN_TYPES.PRESENCE,
        { event: REALTIME_PRESENCE_LISTEN_EVENTS.JOIN },
        (payload: RealtimePresenceJoinPayload<PresenceJoinPayload>) => {
          if (callbacks.onJoin && channel.value)
            callbacks.onJoin(payload, channel.value);
        },
      );
    }

    if (callbacks.onLeave) {
      channel.value.on(
        REALTIME_LISTEN_TYPES.PRESENCE,
        { event: REALTIME_PRESENCE_LISTEN_EVENTS.LEAVE },
        callbacks.onLeave,
      );
    }

    if (callbacks.onKicked) {
      channel.value.on < ROOM_KICK_PAYLOAD>(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: ROOM_KICK_EVENT.KICK },
        callbacks.onKicked,
      );
    }

    channel.value.subscribe(async (status) => {
      if (status !== REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
        console.error(
          "Failed to subscribe to presence channel. STATUS:",
          status,
        );
      }

      if (callbacks.onSubscribe) {
        if (
          channel.value)
          callbacks.onSubscribe(channel.value);
        else
          console.error("Failed to properly subscribe to presence channel. STATUS:", status);
      }
    });
  },

  );

  return channel;
}
