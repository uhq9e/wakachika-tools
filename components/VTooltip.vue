<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger v-bind="$attrs" as-child>
        <slot name="default" />
      </TooltipTrigger>
      <TooltipContent>
        <slot name="content" />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
