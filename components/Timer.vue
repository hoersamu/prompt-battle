<script setup lang="ts">
const {
  timeLimit,
  timeLeft
} = defineProps<{
  timeLimit: number;
  timeLeft: number;
}>();


const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};

const formatedTime = computed(() => {
  const minutes = Math.floor(timeLeft / 60);
  let seconds: string | number = timeLeft % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
})

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / timeLimit;
  return rawTimeFraction - (1 / timeLimit) * (1 - rawTimeFraction);
}

const pathColor = computed(() => {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    return alert.color;
  } else if (timeLeft <= warning.threshold) {
    return warning.color;
  } else {
    return info.color;
  }
});

const circleDashArray = computed(() => {
  return `${(calculateTimeFraction() * FULL_DASH_ARRAY).toFixed(0)} 283`;
});
</script>

<template>
  <div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
        <path id="base-timer-path-remaining" :stroke-dasharray="circleDashArray" class="base-timer__path-remaining"
          :color="pathColor" d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "></path>
      </g>
    </svg>
    <span id="base-timer-label" class="base-timer__label">{{ formatedTime }}</span>
  </div>
</template>

<style scoped lang="scss">
body {
  font-family: sans-serif;
  display: grid;
  height: 100vh;
  place-items: center;
}

.base-timer {
  position: relative;
  width: 300px;
  height: 300px;
}

.base-timer__svg {
  transform: scaleX(-1);
}

.base-timer__circle {
  fill: none;
  stroke: none;
}

.base-timer__path-elapsed {
  stroke-width: 7px;
  stroke: grey;
}

.base-timer__path-remaining {
  stroke-width: 7px;
  stroke-linecap: round;
  transform: rotate(90deg);
  transform-origin: center;
  transition: 1s linear all;
  fill-rule: nonzero;
  stroke: currentColor;
}

.base-timer__label {
  position: absolute;
  width: 300px;
  height: 300px;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
}

</style>