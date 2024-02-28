import { type RealtimeChannel, createClient } from "@supabase/supabase-js";
import {
  SUPABASE_KEY,
  SUPABASE_URL,
} from "@/config/supabase";

export function useSupabase() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const channel = ref<RealtimeChannel>();

  const joinChannel = (room: string) => {
    channel.value = supabase.channel(room, {
      config: {
        broadcast: { self: true },
        presence: { key: "players" },
      },
    });
  };

  return {
    joinChannel,
    channel,
  };
}
