import type { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import type { Database } from "./database.types";

export type Game = Database["public"]["Tables"]["games"]["Row"];
export type GameUpdatePayload = RealtimePostgresUpdatePayload<Game>;
