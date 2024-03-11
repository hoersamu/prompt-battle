<script setup lang="ts">
defineProps<{ label: string, link: string }>();
</script>

<template>
  <nuxt-link class="link-button" :href="link">
    {{ label }}
  </nuxt-link>
</template>

<style scoped lang="scss">
.link-button {
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
</style>
