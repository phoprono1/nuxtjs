// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
  ],
  colorMode: {
    classSuffix: "",
    preference: "system",
    fallback: "light",
  },
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL || 'https://dt-mdeploy-production.up.railway.app/api',
      backendUrl: process.env.BACKEND_URL || 'https://dt-mdeploy-production.up.railway.app',
    },
  },
  css: ["~/assets/css/scrollbar.css"],
});
