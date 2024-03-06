import { useStorage } from "@vueuse/core";

export const useUsername = () => useStorage("username", "");
