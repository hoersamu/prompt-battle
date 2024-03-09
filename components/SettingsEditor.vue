<script setup lang="ts">
import { DEFAULT_SETTINGS } from "@/config/settings";
import type { Settings } from "@/types/settings";

const { settings } = defineProps<{
  settings: Settings
}>();

const emit = defineEmits<{
  submit: [settings: Settings]
}>();

const settingsCopy = ref({ ...settings });

function onSubmit() {
  emit("submit", settingsCopy.value);
}

function resetSettings() {
  settingsCopy.value = { ...DEFAULT_SETTINGS };
  onSubmit();
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div
      v-for="[name, value] in Object.entries(settingsCopy)"
      :key="name"
    >
      <label :for="name">{{ name }}</label>
      <input
        :id="name"
        v-model="settingsCopy[name as keyof Settings]"
        :type="typeof value === 'number' ? 'number' : 'text'"
      >
    </div><div>
      <button type="submit">
        Save Settings
      </button>
      <button @click.prevent="resetSettings">
        Reset Settings
      </button>
    </div>
  </form>
</template>
