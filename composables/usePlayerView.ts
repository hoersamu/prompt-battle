import { Events } from '@/config';
import type { PromptEvent } from '@/types';
import { REALTIME_LISTEN_TYPES, REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';

import { v4 as uuidv4 } from 'uuid';
export const usePlayerView = (prompt: Ref<string>) => {
  const { joinChannel, channel } = useSupabase();
  const id = uuidv4();

  const joinRoom = async (roomId: string, name: string) => {
    joinChannel(roomId);

    channel.value?.subscribe(async (status) => {
      if (status !== REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
        console.error('Failed to subscribe to presence channel. STATUS:', status)
        return
      }

      const res = await channel.value?.track({ name, id });

      if (res !== 'ok') {
        console.error('Failed to track player', res)
      }
    });
  };

  watch(prompt, async (newPrompt) => {
    if (newPrompt) {
      const payload: PromptEvent['payload'] = {
        playerId: id,
        prompt: newPrompt
      }

      channel.value?.send({
        type: REALTIME_LISTEN_TYPES.BROADCAST,
        payload,
        event: Events.PROMPT
      })
    }
  });

  return {
    joinRoom
  }
}
