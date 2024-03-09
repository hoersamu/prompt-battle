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
  <CardPage animated>
    <div v-auto-animate class="index__wrapper-join">
      <p v-if="errorMsg" class="index__error-banner">
        {{ errorMsg }}
      </p>
      <form @submit.prevent="handleJoin">
        <input
          v-model.number="selectedRoom"
          class="index__input-room"
          inputmode="numeric"
          placeholder="Room number"
        >
        <button type="submit" class="index__button bm-0" @click="handleJoin">
          Join Game
        </button>
      </form>
    </div>
    <nuxt-link class="index__button" to="/admin">
      Create Game
    </nuxt-link>
  </CardPage>
</template>

<style scoped lang="scss">
.index__wrapper-join {
  border-bottom: 3px solid #000;
  padding: 0 2rem 2rem 2rem;

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
