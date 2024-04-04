<script>
import "./global.css";
</script>

<template>
  <Head>
    <Link rel="icon" href="/favicon.ico" sizes="32x32" />
    <Link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
    <Link rel="apple-touch-icon" href="/pwa-192x192.png" sizes="192x192" />
    <Link rel="manifest" href="/manifest.webmanifest" />
    <Meta name="theme-color" content="#9b5c86" />
  </Head>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
