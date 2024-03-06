import { DEFAULT_SETTINGS } from "./../config/settings";
import type { Json } from "@/types/database.types";
import type { Settings } from "@/types/settings";

export function getSettings(settings?: Json): Settings {
  return {
    ...DEFAULT_SETTINGS,
    ...(settings as object ?? {}),
  };
}
