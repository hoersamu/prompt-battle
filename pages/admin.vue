<script setup lang="ts">
const { startRound } = useAdminView('2');
</script>

<template>
  <div class="admin-view">
    <h1>Admin</h1>
    <button @click="startRound">Start Round</button>
  </div>
</template>

<style scoped lang="scss">
.admin-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>