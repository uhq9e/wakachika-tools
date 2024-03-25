<script setup lang="ts">
import type { ISearchItem } from "~/pages/scenario-search.vue";

defineProps<{
  line: ISearchItem;
}>();
</script>

<template>
  <div class="bg-card rounded-md shadow-sm flex flex-col">
    <div class="px-4 py-2">
      <div class="font-medium mb-1">
        {{ line.speaker }}
      </div>
      <div class="text-sm">
        {{ line.text.replace(/\\n/g, "\n") }}
      </div>
    </div>
    <Separator />
    <div class="px-4 py-2 text-xs text-stone-500">
      {{ line.location.replace(/\|/g, " / ") }}
    </div>
  </div>
</template>
