<script setup lang="ts">
import "@fontsource-variable/noto-sans-sc";
import "@fontsource-variable/noto-sans-jp";
import "@fontsource-variable/noto-sans";

const { locale } = useI18n();
</script>

<template>
  <main class="p-4 relative overflow-y-auto">
    <Html :class="`font-${locale}`"></Html>
    <slot />
  </main>
</template>

<style scoped>
main {
  width: 100vw;
  width: 100dvw;
  height: 100vh;
  height: 100dvh;
}
</style>

<style>
.font-zh {
  font-family: "Noto Sans SC Variable", var(--font-family);
}

.font-ja {
  font-family: "Noto Sans JP Variable", var(--font-family);
}

.font-en {
  font-family: "Noto Sans Variable", var(--font-family);
}
</style>
