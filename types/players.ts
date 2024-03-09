import type {
  RealtimePostgresDeletePayload,
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";
import type { Database } from "./database.types";

export type Player = Database["public"]["Tables"]["players"]["Row"];
export type PlayerUpdatePayload = RealtimePostgresUpdatePayload<Player>;
export type PlayerInsertPayload = RealtimePostgresInsertPayload<Player>;
export type PlayerDeletePayload = RealtimePostgresDeletePayload<Player>;
