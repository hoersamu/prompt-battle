<script setup lang="ts">
const { handleLoginOrSignUp } = useAnonymousAuth();

const selectedRoom = defineModel<number>();
const errorMsg = ref<string | undefined>(undefined);

function handleJoin() {
  if (selectedRoom.value === undefined)
    return;

  if (!Number.isInteger(selectedRoom.value)) {
    errorMsg.value = `Invalid room number: "${selectedRoom.value}"`;
    return;
  }

  navigateTo({ path: `/join/${selectedRoom.value}` });
}

await handleLoginOrSignUp();
</script>

<template>
  <div class="index__wrapper-page">
    <div class="index__wrapper-content">
      <div class="index__wrapper-h1">
        <h1>Prompt Battle</h1>
      </div>
      <div v-auto-animate class="index__wrapper-join">
        <p v-if="errorMsg" class="index__error-banner">
          {{ errorMsg }}
        </p>
        <input
          v-model.number="selectedRoom"
          class="index__input-room"
          inputmode="numeric"
          placeholder="Room number"
        >
        <button class="index__button bm-0" @click="handleJoin">
          Join Game
        </button>
      </div>
      <nuxt-link class="index__button" to="/admin">
        Create Game
      </nuxt-link>
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

.index__wrapper-page {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  h1 {
    animation-name: shitty-heading;
    animation-duration: 4s;
    animation-iteration-count: infinite;
  }
}

.index__wrapper-content {
  background-color: var(--color-bg-pastell-4);
  width: 30rem;
  text-align: center;

  box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px,
    rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  border-radius: 0.5rem;
  border: 4px solid #000;
}

.index__wrapper-h1 {
  background: hsla(0, 0%, 100%, 0.5);
  margin: 0;
  padding: 0.5rem 0;
  border-bottom: 4px solid #000;
  height: 8rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.index__wrapper-join {
  border-bottom: 3px solid #000;
  padding: 2rem;

  h2 {
    margin-top: 0;
  }
}

.index__input-room {
  width: 20rem;
  display: block;
  font-size: 1.25rem;
  text-align: center;
  margin: 0 auto;
  border-radius: 0.5rem;
  border: 4px solid #000;
  padding: 0.5rem 0.5rem;
}

.index__button {
  cursor: pointer;
  width: 20rem;
  display: block;
  text-align: center;
  background: hsl(0, 0%, 90%);
  margin: 1.5rem auto;
  padding: 1rem 0.5rem;
  text-decoration: none;
  color: #000;
  font-size: 1.25rem;

  border-radius: 0.5rem;
  border: 4px solid #000;

  transition: all 0.05s ease-out;

  &:hover {
    scale: 1.05;
  }
}

.bm-0 {
  margin-bottom: 0;
}
</style>
