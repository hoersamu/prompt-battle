import { decode } from "base64-arraybuffer";
import { IMAGE_BUCKET } from "@/config/images";

export function useSupabaseStorage() {
  const client = useTypedSupabaseClient();

  const getStorageApi = () => {
    return client.storage.from(IMAGE_BUCKET);
  };

  const uploadImage = (gameId: number, playerId: string, name: string, image: string) => {
    return getStorageApi().upload(`${gameId}/${playerId}/${name}.jpg`, decode(image), { upsert: true });
  };

  const deleteAllImages = async (gameId: number) => {
    const { data: playerList } = await getStorageApi().list(gameId.toString());

    if (!playerList)
      return;

    const pathsToRemove: string[] = [];

    await Promise.all(playerList.map(async (player) => {
      const playerPath = `${gameId}/${player.name}`;
      const { data: imageList } = await getStorageApi().list(playerPath);
      pathsToRemove.push(...imageList?.filter(image => !image.name.startsWith(".")).map(image => `${playerPath}/${image.name}`) || []);
    }));

    return getStorageApi().remove(pathsToRemove);
  };

  return {
    uploadImage,
    deleteAllImages,
  };
}
