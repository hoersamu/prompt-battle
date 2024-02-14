<script setup lang="ts">
import { Events } from '@/config';
import { RealtimeChannel } from '@supabase/supabase-js'

const route = useRoute();


const room = route.query.room?.toString() ?? '';

if (!room) {
  console.log('no room', room)
  await navigateTo('/');
}

const channel = ref<RealtimeChannel>();

const name = ref('');
const prompt = ref('');
const { joinRoom } = usePlayerView(prompt);

const join = () => {
  joinRoom(room, name.value);
}

watch(prompt, (newVal) => {
  if (newVal) {
    channel.value?.send({
      type: 'broadcast',
      event: Events.PROMPT,
      payload: {
        name: name.value,
        prompt: prompt.value,
      },
    });
  }
});
</script>

<template>
  <div>Name</div>
  <input v-model="name" />
  <button @click="join">Send</button>
  <div>Text</div>
  <textarea v-model="prompt" />
</template>