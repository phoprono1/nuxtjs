// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@nuxtjs/dotenv"
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
      API_BASE_URL: process.env.API_BASE_URL,
      backendUrl: process.env.BACKEND_URL || 'http://localhost:3005',
    },
  },
  css: ["~/assets/css/scrollbar.css"],
});
