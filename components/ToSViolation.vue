<template>
  <div class="presenter-user-window__error">
    <p>❌</p>
    <p>ERROR</p>
    <p>You violated the TOS</p>
  </div>
</template>

<style scoped lang="scss">
  .presenter-user-window__error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    font-size: 1.5rem;
    color: var(--color-text-error);
  }
  </style>
