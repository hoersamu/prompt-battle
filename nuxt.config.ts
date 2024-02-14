// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  vite: {
    vue: {
      script: {
         propsDestructure: true
      }
    }
  },
  routeRules: {
    '/play': { ssr: false }
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          '@': [ '.' ],
          '@/*': [ './*' ],
        },
      },
    },
  },
  css: ["@/styles/global.css"],
})
