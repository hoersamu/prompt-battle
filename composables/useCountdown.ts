export function useCountdown(initialLimit = 30) {
  const timeLeft = ref(initialLimit);
  const timeLimit = ref(initialLimit);
  const interval = ref<NodeJS.Timeout>();
  const onEndCallback = ref<() => void>();

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formattedTimeLeft = computed((): string => formatTime(timeLeft.value));

  const startCountdown = (time: number, onEnd?: () => void): void => {
    onEndCallback.value = onEnd;
    timeLimit.value = time;
    timeLeft.value = time;

    clearInterval(interval.value);
    interval.value = setInterval(() => {
      timeLeft.value--;

      if (timeLeft.value <= 0) {
        clearInterval(interval.value);
        if (onEndCallback.value)
          onEndCallback.value();
      }
    }, 1000);
  };

  const stopCountdown = (): void => {
    clearInterval(interval.value);
  };

  onBeforeRouteLeave((): void => {
    clearInterval(interval.value);
  });

  return {
    startCountdown,
    stopCountdown,
    formattedTimeLeft,
    formatTime,
  };
}
