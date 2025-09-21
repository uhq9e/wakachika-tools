// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  vite: {
    build: {
      target: "es2015",
    },
  },
  modules: [
    "@nuxtjs/i18n",
    "@vite-pwa/nuxt",
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "nuxt-icon",
  ],
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
  pwa: {
    strategies: "generateSW",
    registerType: "autoUpdate",
    manifest: {
      name: "WKCK Toolbox",
      short_name: "WKCK Toolbox",
      description: "A YuYuYu toolbox powered by uhq9e",
      theme_color: "#9b5c86",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
      ],
    },
    workbox: {
      globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
      maximumFileSizeToCacheInBytes: 10000000, // 10MB
    },
    injectManifest: {
      globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallback: "/",
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
  },
});
