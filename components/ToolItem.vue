<script setup lang="ts">
const { itemTitle, description, imageSrc, imageAlt } = defineProps<{
  itemTitle: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
}>();

defineSlots<{
  default: () => any;
}>();
</script>

<template>
  <article class="flex flex-col rounded-lg bg-card border">
    <template v-if="imageSrc">
      <div class="h-44 sm:h-64 lg:h-72 relative overflow-hidden">
        <img
          :src="imageSrc"
          :alt="imageAlt ?? ''"
          class="object-cover w-full h-full relative"
          style="z-index: 1"
        />
        <div class="absolute inset-0 grid-bg" />
      </div>
      <hr />
    </template>
    <div class="flex flex-col gap-2 p-4">
      <div class="text-base font-medium">{{ itemTitle }}</div>
      <div v-if="description" class="text-xs/relaxed">{{ description }}</div>
    </div>
  </article>
</template>
