import { Events } from '@/config';
import type { Player, PlayerPresence, PromptEvent } from '@/types';
import { REALTIME_LISTEN_TYPES, REALTIME_PRESENCE_LISTEN_EVENTS, REALTIME_SUBSCRIBE_STATES, type RealtimePresenceJoinPayload, type RealtimePresenceLeavePayload } from '@supabase/supabase-js';

export const usePresenterView = (roomId: string, test: () => void = () => {}) => {
  const { joinChannel, channel } = useSupabase();

  const players = ref<Record<string, Player>>({});

  const onSync = () => {
    const newState = channel.value?.presenceState<PlayerPresence>()

    if (newState && newState.players) {
      newState.players.forEach(({ id, name }) => {
        if (!players.value[id]) {
          players.value[id] = {
            name,
            prompt: ''
          };
        }
      })
    }

    console.log(REALTIME_PRESENCE_LISTEN_EVENTS.SYNC, newState)
  }

  const onJoin = ({ key, newPresences }: RealtimePresenceJoinPayload<never>) => {
    console.log(REALTIME_PRESENCE_LISTEN_EVENTS.JOIN, key, newPresences)
  }

  const onLeave = ({ key, leftPresences }: RealtimePresenceLeavePayload<never>) => {
    console.log(REALTIME_PRESENCE_LISTEN_EVENTS.LEAVE, key, leftPresences)
  }

  const onPrompt = ({ payload }: PromptEvent) => {
    if (payload.playerId in players.value) {
      players.value[payload.playerId].prompt = payload.prompt
    }
  }

  onMounted(() => {
    joinChannel(roomId);

    channel.value?.on(REALTIME_LISTEN_TYPES.PRESENCE, { event: REALTIME_PRESENCE_LISTEN_EVENTS.SYNC }, onSync)
      .on(REALTIME_LISTEN_TYPES.PRESENCE, { event: REALTIME_PRESENCE_LISTEN_EVENTS.JOIN }, onJoin)
      .on(REALTIME_LISTEN_TYPES.PRESENCE, { event: REALTIME_PRESENCE_LISTEN_EVENTS.LEAVE }, onLeave)
      .on(REALTIME_LISTEN_TYPES.BROADCAST, { event: Events.PROMPT }, onPrompt)
      .on(REALTIME_LISTEN_TYPES.BROADCAST, { event: Events.START_ROUND }, test)
      .subscribe(async (status) => {
        if (status !== REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          console.error('Failed to subscribe to presence channel. STATUS:', status)
          return
        }
      });
  })

  return {
    channel,
    players
  }
}
