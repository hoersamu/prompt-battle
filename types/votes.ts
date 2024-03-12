import type {
  RealtimePostgresDeletePayload,
  RealtimePostgresInsertPayload,
  RealtimePostgresUpdatePayload,
} from "@supabase/supabase-js";
import type { Database } from "./database.types";

export type Vote = Database["public"]["Tables"]["votes"]["Row"];
export type VoteUpdatePayload = RealtimePostgresUpdatePayload<Vote>;
export type VoteInsertPayload = RealtimePostgresInsertPayload<Vote>;
export type VoteDeletePayload = RealtimePostgresDeletePayload<Vote>;
