<script setup lang="ts">
const { heading = "Prompt Battle", animated = false } = defineProps<{ heading?: string, animated?: boolean }>();
</script>

<template>
  <div class="card__wrapper-card">
    <div class="card__wrapper-content">
      <div class="card__wrapper-h1">
        <h1 :class="{ 'card__h1--animated': animated }">
          {{ heading }}
        </h1>
      </div>

      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
@keyframes shitty-heading {
  0% {
    rotate: -5deg;
  }
  25% {
    rotate: 5deg;
    scale: 1.3;
  }
  50% {
    rotate: -5deg;
    scale: 1.3;
  }
  75% {
    rotate: 5deg;
  }
  100% {
    rotate: -5deg;
  }
}

.card__wrapper-card {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

}

.card__wrapper-content {
  background-color: var(--color-bg-pastell-4);
  width: 30rem;
  text-align: center;

  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  border-radius: 0.5rem;
  border: 4px solid #000;
}

.card__wrapper-h1 {
  background: hsla(0, 0%, 100%, 0.5);
  margin: 0;
  padding: 0.5rem 0;
  border-bottom: 4px solid #000;
  height: 8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;

}

.card__h1--animated {
  animation-name: shitty-heading;
  animation-duration: 4s;
  animation-iteration-count: infinite;
}
</style>
