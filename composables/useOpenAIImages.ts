import OpenAI from "openai";

export function useOpenAIImages() {
  const generateImages = async (prompt: string): Promise<string[]> => {
    const openai = new OpenAI({ apiKey: "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", dangerouslyAllowBrowser: true });

    // throw new Error('OpenAI API key not set');

    // return [
    //   'https://placekitten.com/200/200',
    //   'https://placekitten.com/201/201',
    //   'https://placekitten.com/202/202',
    //   'https://placekitten.com/203/203',
    // ];

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
    }).then((response) => {
      return response.data.map(image => image.url as string);
    });
  };

  return {
    generateImages,
  };
}
