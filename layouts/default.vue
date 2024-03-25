<script setup lang="ts">
import "@fontsource-variable/noto-sans-sc";
import "@fontsource-variable/noto-sans-jp";
import "@fontsource-variable/noto-sans";

const { locale } = useI18n();
</script>

<template>
  <main class="w-screen h-screen p-4 relative overflow-y-auto">
    <Html :class="`font-${locale}`"></Html>
    <slot />
  </main>
</template>

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
