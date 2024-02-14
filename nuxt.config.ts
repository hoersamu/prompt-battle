// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  vite: {
    vue: {
      script: {
        propsDestructure: true,
      },
    },
  },
  css: ["@/styles/global.css"],
});
