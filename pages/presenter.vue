<script setup lang="ts">
import { createClient } from "@supabase/supabase-js";
import { PresenterState } from "../config/presenter";
const supabase = createClient(
  "https://qvmyzaxnpycusghepyyz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2bXl6YXhucHljdXNnaGVweXl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc5MzAxNDksImV4cCI6MjAyMzUwNjE0OX0.a1h9aPPhZcoflKeT9ZS0iKHyCLav4VnrQadmDRyRLHg"
);

const players: { name: string; points?: number }[] = [
  { name: "Thomas", points: 2 },
  { name: "Samuel", points: 10 },
  { name: "Markus" },
  // { name: "Markus", points: 3 },
];
</script>

<template>
  <div class="presenter__wrapper">
    <PresenterUserWindow
      v-for="(player, index) in players"
      :key="`player-${index}`"
      :name="player.name"
      :state="PresenterState.Waiting"
      :points="player.points"
    />
  </div>
</template>

<style>
html {
  overscroll-behavior: none;
}
body {
  background: #000;
}
</style>

<style scoped>
.presenter__wrapper {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.presenter-user-window__wrapper:nth-child(1) {
  background: var(--color-bg-pastell-1);
}
.presenter-user-window__wrapper:nth-child(2) {
  background: var(--color-bg-pastell-2);
}
.presenter-user-window__wrapper:nth-child(3) {
  background: var(--color-bg-pastell-3);
}
.presenter-user-window__wrapper:nth-child(4) {
  background: var(--color-bg-pastell-4);
}
</style>
