<script setup lang="ts">
const { handleLoginOrSignUp } = useAnonymousAuth();

await handleLoginOrSignUp();
</script>

<template>
  <nuxt-link to="" />
  <nuxt-link to="/admin">
    Create Game
  </nuxt-link>
</template>
