import OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import { decode } from "base64-arraybuffer";
import { useStorage } from "@vueuse/core";

export function useOpenAIImages() {
  const client = useTypedSupabaseClient();
  const gameId = useGameId();

  const savedKey = useStorage("openai-api-key", "");

  const apiKey = ref(savedKey.value);
  const saveKey = ref(false);

  const generateImages = async (prompt: string, playerId: string): Promise<string[]> => {
    if (!apiKey.value)
      throw new Error("OpenAI API key not set");

    const openai = new OpenAI({ apiKey: apiKey.value, dangerouslyAllowBrowser: true });

    // throw new Error('OpenAI API key not set');

    // Throws 400
    // {
    //   "error": {
    //     "code": "content_policy_violation",
    //     "message": "Your request was rejected as a result of our safety system. Your prompt may contain text that is not allowed by our safety system.",
    //     "param": null,
    //     "type": "invalid_request_error"
    //   }
    // }
    return openai.images.generate({
      prompt,
      model: "dall-e-2",
      n: 4,
      size: "512x512",
      response_format: "b64_json",
    }).then(async (response) => {
      const images = response.data.map(image => image.b64_json as string);

      const imageUploads = images.map((image) => {
        return client.storage.from("images").upload(`${gameId}/${playerId}/${uuidv4()}.jpg`, decode(image), { upsert: true });
      });
      const uploadedImages = await Promise.all(imageUploads);
      return uploadedImages.map(image => image.data?.path).filter((path): path is string => Boolean(path));
    });
  };

  watch(saveKey, () => {
    if (!saveKey.value)
      savedKey.value = "";
    else
      savedKey.value = apiKey.value;
  });

  watch(apiKey, () => {
    if (saveKey.value)
      savedKey.value = apiKey.value;
  });

  return {
    generateImages,
    apiKey,
    saveKey,
  };
}
