import { Events } from '@/config';
import type { GameStartEvent, ImagesReadyEvent } from '@/types';
import { REALTIME_LISTEN_TYPES } from '@supabase/supabase-js';
import { useOpenAIImages } from './useOpenAIImages';

export const useAdminView = (roomId: string) => {
  const { players, channel } = usePresenterView(roomId);
  const { generateImages } = useOpenAIImages();
  const time = ref(0);
  const timeLimit = ref(30);

  let interval: NodeJS.Timeout;

  const sendImages = (images: string[]) => {
    const payload: ImagesReadyEvent['payload'] = {
      images
    }

    channel.value?.send({
      type: REALTIME_LISTEN_TYPES.BROADCAST,
      payload,
      event: Events.IMAGES_READY
    })
  }

  const startImageGeneration = async () => {
    const playerlist = Object.values(players.value);

    const images = await generateImages(playerlist[0].prompt);
    sendImages(images);
  }

  const startRound = () => {
    clearInterval(interval);
    const payload: GameStartEvent['payload'] = {
      timeLimit: timeLimit.value
    }

    channel.value?.send({
      type: REALTIME_LISTEN_TYPES.BROADCAST,
      payload,
      event: Events.START_ROUND
    })

    // Add a couple seconds to the time limit to account for the time it takes to sync the start event
    time.value = timeLimit.value + 1;

    interval = setInterval(() => {
      time.value--;
      if (time.value <= 0) {
        clearInterval(interval);
        startImageGeneration();
      }
    }, 1000)
  }



  return {
    players,
    startRound,
    sendImages,
  }
}
