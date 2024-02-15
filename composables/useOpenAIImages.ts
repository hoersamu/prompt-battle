import OpenAI from 'openai';

export const useOpenAIImages = () => {
  const generateImages = async (prompt: string) => {
    const openai = new OpenAI({ apiKey: '', dangerouslyAllowBrowser: true });

    return openai.images.generate({
      prompt,
      model: 'dall-e-2',
      n: 4,
    })
  };

  return {
    generateImages
  }
}