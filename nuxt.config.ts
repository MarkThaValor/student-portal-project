// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt'
  ],
  css: ['~/assets/css/tailwind.css'],
  runtimeConfig: {
    public: {
      // @ts-ignore
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    }
  },
  app: {
    head: {
      title: 'Student Performance Portal',
      meta: [
        { name: 'description', content: 'Clean, bespoke, and professional student academic analysis portal.' },
        { name: 'theme-color', content: '#0f172a' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'StudentPortal' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'msapplication-TileColor', content: '#0f172a' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/pwa-192x192.png' },
        { rel: 'apple-touch-icon', sizes: '152x152', href: '/pwa-192x192.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/pwa-192x192.png' },
        { rel: 'apple-touch-icon', sizes: '167x167', href: '/pwa-192x192.png' }
      ]
    }
  },
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Student Performance Portal',
      short_name: 'StudentPortal',
      description: 'Clean, bespoke, and professional student academic analysis portal.',
      theme_color: '#0f172a',
      background_color: '#f8fafc',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/dashboard',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ]
    },
    workbox: {
      navigateFallback: '/'
    },
    client: {
      installPrompt: true
    }
  }
})


