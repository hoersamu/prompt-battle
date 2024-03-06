import type { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import type { PresenterState } from "../config/presenter";
import type { Database } from "./database.types";

export interface Player {
  name: string
  prompt: string
  state: PresenterState
  images: string[]
  selectedImage: number | undefined
}

export type Game = Database["public"]["Tables"]["games"]["Row"];
export type GameUpdatePayload = RealtimePostgresUpdatePayload<Game>;
