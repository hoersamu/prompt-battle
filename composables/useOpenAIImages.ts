import OpenAI from 'openai';

export const useOpenAIImages = () => {
  const generateImages = async (prompt: string): Promise<string[]> => {
    // const openai = new OpenAI({ apiKey: '', dangerouslyAllowBrowser: true });

    return [
      'https://cataas.com/cat',
      'https://cataas.com/cat',
      'https://cataas.com/cat',
      'https://cataas.com/cat',
    ]

    // Throws 400
    // {
    //   "error": {
    //     "code": "content_policy_violation",
    //     "message": "Your request was rejected as a result of our safety system. Your prompt may contain text that is not allowed by our safety system.",
    //     "param": null,
    //     "type": "invalid_request_error"
    //   }
    // }
    // return openai.images.generate({
    //   prompt,
    //   model: 'dall-e-2',
    //   n: 4,
    // }).then((response) => {
    //   return response.data.map((image) => image.url as string);
    // });
  };

  return {
    generateImages
  }
}