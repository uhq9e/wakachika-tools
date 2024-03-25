<script setup lang="ts">
const localePath = useLocalePath();
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 mb-4">
    <NuxtLink :href="localePath('/')" class="flex items-center gap-2">
      <Icon name="uil:wrench" />
      <span class="text-sm">{{ $t("shared.moreTools") }}</span>
    </NuxtLink>
    <span class="text-sm text-stone-400">/</span>
    <p class="text-2xl font-bold">
      <slot />
    </p>
  </div>
</template>
