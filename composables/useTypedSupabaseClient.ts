import type { Database } from "@/types/database.types";

export function useTypedSupabaseClient() {
  return useSupabaseClient<Database>();
};
