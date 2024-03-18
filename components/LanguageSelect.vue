<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
});

const { locale, localeCodes } = useI18n();
const switchLocalePath = useSwitchLocalePath();
const router = useRouter();
</script>

<template>
  <Select
    :model-value="locale"
    @update:model-value="
      router.push({
        path: switchLocalePath($event),
        query: { ...router.currentRoute.value.query },
      })
    "
  >
    <SelectTrigger v-bind="$attrs">
      <SelectValue :placeholder="$t('shared.language')" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>{{ $t("shared.language") }}</SelectLabel>
        <SelectItem v-for="code in localeCodes" :key="code" :value="code">{{
          $t(`shared.languageNames.${code}`)
        }}</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
