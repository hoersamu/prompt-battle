import { Events } from '@/config';
import type { GameStartEvent, ImagesReadyEvent, ToSViolation } from '@/types';
import { REALTIME_LISTEN_TYPES } from '@supabase/supabase-js';
import { useOpenAIImages } from './useOpenAIImages';

export const useAdminView = (roomId: string) => {
  const { players, channel } = usePresenterView(roomId);
  const { generateImages } = useOpenAIImages();
  const time = ref(0);
  const timeLimit = ref(1);

  let interval: NodeJS.Timeout;

  const sendImages = (playerId: string, images: string[]) => {
    const payload: ImagesReadyEvent['payload'] = {
      images,
      playerId
    }

    channel.value?.send({
      type: REALTIME_LISTEN_TYPES.BROADCAST,
      payload,
      event: Events.IMAGES_READY
    })
  }

  const sendTosViolation = (playerId: string) => {
    const payload: ToSViolation['payload'] = {
      playerId
    }

    channel.value?.send({
      type: REALTIME_LISTEN_TYPES.BROADCAST,
      payload,
      event: Events.TOS_VIOLATION
    })
  }

  const startImageGeneration = async () => {
    const playerlist = Object.entries(players.value);

    playerlist.forEach(([playerId, { prompt }]) => {
      generateImages(prompt).then((images) => {
        sendImages(playerId, images);
      }).catch(() => { sendTosViolation(playerId) })
    });
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
