import {
  REALTIME_LISTEN_TYPES,
  REALTIME_PRESENCE_LISTEN_EVENTS,
  REALTIME_SUBSCRIBE_STATES,
  type RealtimePresenceJoinPayload,
  type RealtimePresenceLeavePayload,
} from "@supabase/supabase-js";
import { PresenterState } from "../config/presenter";
import { Events } from "@/config";
import type {
  GameStartEvent,
  ImageSelectEvent,
  ImagesReadyEvent,
  Player,
  PlayerPresence,
  PromptEvent,
  ToSViolationEvent,
} from "@/types";

export function usePresenterView(roomId: string, onRoundStartCallback: (event: GameStartEvent) => void = () => {}) {
  const { joinChannel, channel } = useSupabase();

  const players = ref<Record<string, Player>>({});

  const onSync = () => {
    const newState = channel.value?.presenceState<PlayerPresence>();

    if (newState && newState.players) {
      newState.players.forEach(({ id, name }) => {
        if (!players.value[id]) {
          players.value[id] = {
            name,
            prompt: "",
            state: PresenterState.Overview,
            images: [],
            selectedImage: undefined,
          };
        }
      });
    }

    console.log(REALTIME_PRESENCE_LISTEN_EVENTS.SYNC, newState);
  };

  const onJoin = ({
    key,
    newPresences,
  }: RealtimePresenceJoinPayload<never>) => {
    console.log(REALTIME_PRESENCE_LISTEN_EVENTS.JOIN, key, newPresences);
  };

  const onLeave = ({
    key,
    leftPresences,
  }: RealtimePresenceLeavePayload<never>) => {
    console.log(REALTIME_PRESENCE_LISTEN_EVENTS.LEAVE, key, leftPresences);
  };

  const onPromptUpdate = ({ payload }: PromptEvent) => {
    if (payload.playerId in players.value)
      players.value[payload.playerId].prompt = payload.prompt;
  };

  const onImagesReady = ({ payload }: ImagesReadyEvent) => {
    players.value[payload.playerId].images = payload.images;
    players.value[payload.playerId].state = PresenterState.ImageSelection;
  };

  const onSelectImage = ({ payload }: ImageSelectEvent) => {
    players.value[payload.playerId].selectedImage = payload.imageIndex;
    players.value[payload.playerId].state = PresenterState.ImageSelected;
  };

  const onToSViolation = ({ payload }: ToSViolationEvent) => {
    players.value[payload.playerId].state = PresenterState.Error;
  };

  const onRoundStart = (event: GameStartEvent) => {
    Object.values(players.value).forEach((player) => {
      player.state = PresenterState.Typing;
    });
    onRoundStartCallback(event);
  };

  onMounted(() => {
    joinChannel(roomId);

    channel.value
      ?.on(
        REALTIME_LISTEN_TYPES.PRESENCE,
        { event: REALTIME_PRESENCE_LISTEN_EVENTS.SYNC },
        onSync,
      )
      .on(
        REALTIME_LISTEN_TYPES.PRESENCE,
        { event: REALTIME_PRESENCE_LISTEN_EVENTS.JOIN },
        onJoin,
      )
      .on(
        REALTIME_LISTEN_TYPES.PRESENCE,
        { event: REALTIME_PRESENCE_LISTEN_EVENTS.LEAVE },
        onLeave,
      )
      .on(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: Events.PROMPT },
        onPromptUpdate,
      )
      .on(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: Events.START_ROUND },
        onRoundStart,
      )
      .on(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: Events.IMAGES_READY },
        onImagesReady,
      )
      .on(
        REALTIME_LISTEN_TYPES.BROADCAST,
        { event: Events.SELECT_IMAGE },
        onSelectImage,
      ).on(REALTIME_LISTEN_TYPES.BROADCAST, { event: Events.TOS_VIOLATION }, onToSViolation)
      .subscribe(async (status) => {
        if (status !== REALTIME_SUBSCRIBE_STATES.SUBSCRIBED) {
          console.error(
            "Failed to subscribe to presence channel. STATUS:",
            status,
          );
        }
      });
  });

  return {
    channel,
    players,
  };
}
