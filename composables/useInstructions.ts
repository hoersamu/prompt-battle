import type { Database } from "@/types/database.types";

export type Instruction = Database["public"]["Tables"]["instruction"]["Row"];

export function useInstructions(gameId: number) {
  const client = useTypedSupabaseClient();
  const user = useSupabaseUser();

  const instructions = ref<Instruction[]>([]);
  const getInstructionsForGame = async () => {
    if (!user.value)
      return Logger.error("User not logged in");

    const { data, error } = await client.from("instruction").select().eq("game_id", gameId);

    if (error)
      return Logger.error(error.message);

    if (!data)
      return Logger.error("No data found");

    instructions.value = data;
  };

  const createInstruction = async (instruction: string) => {
    if (!user.value)
      return Logger.error("User not logged in");

    const { data, error } = await client.from("instruction").insert({
      game_id: gameId,
      instruction,
    }).select();

    if (error)
      return Logger.error(error.message);

    if (!data)
      return Logger.error("No data found");

    instructions.value.push(data[0]);
  };

  const updateInstruction = async (id: number, instruction: string) => {
    if (!user.value)
      return Logger.error("User not logged in");

    const { data, error } = await client.from("instruction").update({ instruction }).eq("id", id).select();

    if (error)
      return Logger.error(error.message);

    if (!data || !data.length)
      return Logger.error("No data found");

    const index = instructions.value.findIndex(i => i.id === id);
    instructions.value[index] = data[0];
  };

  const deleteInstruction = async (id: number) => {
    if (!user.value)
      return Logger.error("User not logged in");

    const { data, error } = await client.from("instruction").delete().eq("id", id).select();

    if (error)
      return Logger.error(error.message);

    if (!data || !data.length)
      return Logger.error("No data found");

    const index = instructions.value.findIndex(i => i.id === id);
    instructions.value.splice(index, 1);
  };

  return {
    instructions,
    deleteInstruction,
    updateInstruction,
    createInstruction,
    getInstructionsForGame,
  };
}
