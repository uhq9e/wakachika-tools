// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/i18n", "@nuxtjs/tailwindcss", "shadcn-nuxt", "nuxt-icon"],
  shadcn: {
    prefix: "",
    componentDir: "./components/ui",
  },
  i18n: {
    vueI18n: "./i18n.config.ts",
    locales: [
      {
        code: "zh",
        file: "zh.json",
      },
      {
        code: "ja",
        file: "ja.json",
      },
      {
        code: "en",
        file: "en.json",
      },
    ],
    lazy: true,
    langDir: "./locales",
    defaultLocale: "en",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root",
    },
    strategy: "prefix_except_default",
  },
});
