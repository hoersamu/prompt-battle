export function useCountdown(initialLimit = 30) {
  const timeLeft = ref(initialLimit);
  const timeLimit = ref(initialLimit);
  const interval = ref<NodeJS.Timeout>();
  const onEndCallback = ref<() => void>();

  const formattedTimeLeft = computed(() => {
    const minutes = Math.floor(timeLeft.value / 60);
    const seconds = timeLeft.value % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  });

  const startCountdown = (time: number, onEnd?: () => void) => {
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

  const stopCountdown = () => {
    clearInterval(interval.value);
  };

  onBeforeRouteLeave(() => {
    clearInterval(interval.value);
  });

  return {
    startCountdown,
    stopCountdown,
    formattedTimeLeft,
  };
}
