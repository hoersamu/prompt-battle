import { Events } from '@/config';
import { PLAYER_STATES } from '@/config/players';
import type { GameStartEvent, ImageSelectEvent, ImagesReadyEvent, PromptEvent } from '@/types';
import { REALTIME_LISTEN_TYPES, REALTIME_SUBSCRIBE_STATES } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

export const usePlayerView = (prompt: Ref<string>) => {
  const { joinChannel, channel } = useSupabase();
  const playerId = uuidv4();
  const state = ref<PLAYER_STATES>(PLAYER_STATES.NAME_INPUT);
  const images = ref<string[]>([]);
  const timeLimit = ref<number>(0);
  const timeLeft = ref<number>(0);

  let interval: NodeJS.Timeout;

  const onGameStart = ({payload}: GameStartEvent) => {
    state.value = PLAYER_STATES.PLAYING;
    timeLimit.value = payload.timeLimit;
    timeLeft.value = payload.timeLimit;

    interval = setInterval(() => {
      timeLeft.value--;

      if (timeLeft.value === 0) {
        state.value = PLAYER_STATES.WAITING;
        clearInterval(interval);
      }
    }, 1000)
  };

  const onImagesReady = ({payload}: ImagesReadyEvent) => {
    if(payload.playerId !== playerId) return;

    images.value = payload.images;
    state.value = PLAYER_STATES.IMAGE_SELECTION;
  };

  const joinRoom = async (roomId: string, name: string) => {
    joinChannel(roomId);

    channel.value?.on(REALTIME_LISTEN_TYPES.BROADCAST, { event: Events.START_ROUND }, onGameStart)
      .on(REALTIME_LISTEN_TYPES.BROADCAST, { event: Events.IMAGES_READY }, onImagesReady)
      .subscribe(async (status) => {
        if (status !== REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          console.error('Failed to subscribe to presence channel. STATUS:', status)
          return
        }

        const res = await channel.value?.track({ name, id: playerId });

        if (res !== 'ok') {
          console.error('Failed to track player', res)
        }

        state.value = PLAYER_STATES.READY;
      });
  };

  const selectImage = (index: number) => {
    const payload: ImageSelectEvent['payload'] = {
      playerId,
      imageIndex: index,
    }

    channel.value?.send({
      type: REALTIME_LISTEN_TYPES.BROADCAST,
      payload,
      event: Events.PROMPT
    })

    state.value = PLAYER_STATES.IMAGE_SELECTED;
  }

  watch(prompt, async (newPrompt) => {
    if (newPrompt) {
      const payload: PromptEvent['payload'] = {
        playerId,
        prompt: newPrompt
      }

      channel.value?.send({
        type: REALTIME_LISTEN_TYPES.BROADCAST,
        payload,
        event: Events.PROMPT
      })
    }
  });

  onBeforeUnmount(() => {
    clearInterval(interval);
  });

  return {
    state,
    joinRoom,
    timeLeft,
    timeLimit,
    images,
    selectImage,
  }
}
