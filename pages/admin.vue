<script setup lang="ts">
const { startRound, sendImages, players} = useAdminView('2');

import OpenAI from "openai";

const images = ref<OpenAI.Image[]>([]);


const openai = new OpenAI({apiKey:'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', dangerouslyAllowBrowser: true});

const generate = ()=>openai.images.generate({
  prompt: "A painting of a cat",
  model: 'dall-e-2',
  n: 4,
}).then((response) => {
  sendImages(response.data.map((image) => image.url) as string[])
  images.value = response.data;
}).catch((error) => {
  console.log(error)
});
</script>

<template>
    <h1>Admin</h1>
    <button @click="startRound">Start Round</button>
    <button >Send images</button>
    <button @click="generate">generate</button>
    <div>
        <img v-for="image in images" :src="image.url" />
    </div>
</template>
