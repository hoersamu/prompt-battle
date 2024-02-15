<script setup lang="ts">
const { startRound } = useAdminView('2');
</script>

<template>
    <h1>Admin</h1>
    <button @click="startRound">Start Round</button>
</template>
