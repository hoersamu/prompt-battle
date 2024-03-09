import { IMAGE_BUCKET, SUPABASE_STORAGE_PATH } from "@/config/images";

export function useImageBasePath() {
  const { public: { supabase } } = useRuntimeConfig();

  return `${supabase.url}${SUPABASE_STORAGE_PATH}/${IMAGE_BUCKET}/`;
}
