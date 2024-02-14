import { createClient, REALTIME_LISTEN_TYPES, REALTIME_PRESENCE_LISTEN_EVENTS, REALTIME_SUBSCRIBE_STATES, type RealtimeChannel, type RealtimeChannelSendResponse } from '@supabase/supabase-js';
import {
  SUPABASE_KEY,
  SUPABASE_URL
} from '@/config/supabase';

export const useSupabase = () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const channel = ref<RealtimeChannel>();

  const joinChannel = (room: string) => {
    channel.value = supabase.channel(room, {
      config: {
        broadcast: { self: true },
        presence: { key: 'players' }
      },
    });
  };

  return {
    joinChannel,
    channel,
  }
}