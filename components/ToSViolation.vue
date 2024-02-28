<template>
  <div class="tos-violation">
    <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" >
      <path
        d="M480-320q17 0 28.5-11.5T520-360q0-17-11.5-28.5T480-400q-17 0-28.5 11.5T440-360q0 17 11.5 28.5T480-320Zm-40-160h80v-200h-80v200Zm40 400q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q104-33 172-132t68-220v-189l-240-90-240 90v189q0 121 68 220t172 132Zm0-316Z" />
    </svg>

    <p>ERROR</p> -->
    <p>You violated the TOS</p>
  </div>
</template>

<style scoped lang="scss">
.tos-violation {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 1.5rem;
  color: var(--color-text-error);
  height: 100%;
}

.tos-violation p {
  text-align: center;
  font-size: 7rem;
  margin: 0;
  color: red;
}

.tos-violation svg {
  fill: red;
  height: 120px;
  width: 120px  ;
  background-color: #fff;
  border-radius: 25%;
  padding: 0.5rem;
  border: 4px solid black;
  margin: 0 0 1rem 0;
}
</style>
