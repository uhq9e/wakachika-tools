<script setup lang="ts">
import { LogoGenerator, nowayu, kumeyu } from "dearu-logo-generator";
import type { ILogoMeta } from "dearu-logo-generator/types/lib/types/shared";

const localePath = useLocalePath();
const { t } = useI18n();

useSeoMeta({
  title: t("pages./logo-generator.title"),
  description: t("pages./logo-generator.description"),
  ogImage: "/tools/logo-generator.webp",
  twitterImage: "/tools/logo-generator.webp",
});

const seriesMap: Record<string, ILogoMeta> = {
  nowayu: nowayu,
  kumeyu: kumeyu,
};

const defaultSeries = "nowayu";

const lg = new LogoGenerator(seriesMap[defaultSeries]);

const firstLine = ref("乃木若葉は");
const secondLine = ref("勇者である");

const isVertical = ref(false);

const selectedSeries = ref(defaultSeries);

const currentSeriesMeta = computed(() => {
  return seriesMap[selectedSeries.value];
});

const svgEl = ref(await onGenerate());
const svgStr = computed(() => svgEl.value.outerHTML);

async function generate(
  firstLine: string,
  secondLine: string
): Promise<SVGSVGElement> {
  const svgEl = await lg.generate(firstLine, secondLine);
  return svgEl;
}

async function onGenerate(): Promise<SVGSVGElement> {
  return await generate(firstLine.value, secondLine.value);
}

function onSave() {
  const img = new Image();
  img.src = `data:image/svg+xml;base64,${btoa(svgStr.value)}`;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = svgEl.value.viewBox.baseVal.width;
    canvas.height = svgEl.value.viewBox.baseVal.height;

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);

    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `${firstLine.value}_${secondLine.value}.png`;
    a.click();
  };
}

watch([firstLine, secondLine, currentSeriesMeta, isVertical], async () => {
  lg.setMeta(currentSeriesMeta.value);
  lg.setDirection(isVertical.value ? "vertical" : "horizontal");
  const _svgEl = await onGenerate();
  svgEl.value = _svgEl;
});
</script>

<template>
  <div class="size-full flex flex-col">
    <div class="flex flex-wrap items-center gap-2">
      <NuxtLink :href="localePath('/')" class="flex items-center gap-2">
        <Icon name="uil:wrench" />
        <span class="text-sm">{{ $t("shared.moreTools") }}</span>
      </NuxtLink>
      <span class="text-sm text-stone-400">/</span>
      <p class="text-2xl font-bold">
        {{ $t("pages./logo-generator.title") }}
      </p>
    </div>
    <div class="grow flex flex-col justify-center items-center gap-4">
      <div
        class="flex justify-center w-full *:max-w-2xl *:max-h-[75vh]"
        v-html="svgStr"
      ></div>
      <div class="flex flex-col sm:flex-row sm:items-end gap-3">
        <div class="flex flex-col gap-1.5">
          <Label for="firstline">
            {{ $t("pages./logo-generator.firstLine") }}
          </Label>
          <Input
            v-model="firstLine"
            id="firstline"
            type="text"
            :placeholder="$t('pages./logo-generator.firstLine')"
          />
        </div>
        <div class="flex flex-col gap-1.5">
          <Label for="secondline">
            {{ $t("pages./logo-generator.secondLine") }}
          </Label>
          <Input
            v-model="secondLine"
            id="secondline"
            type="text"
            :placeholder="$t('pages./logo-generator.secondLine')"
          />
        </div>
        <div class="flex gap-2">
          <Popover>
            <PopoverTrigger as-child>
              <VTooltip>
                <Button variant="outline" size="icon">
                  <Icon name="uil:setting" />
                </Button>
                <template #content
                  ><p>{{ $t("shared.options") }}</p></template
                >
              </VTooltip>
            </PopoverTrigger>
            <PopoverContent class="flex flex-col gap-3">
              <Select v-model="selectedSeries">
                <SelectTrigger>
                  <SelectValue
                    :placeholder="$t('pages./logo-generator.selectSeries')"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{{
                      $t("pages./logo-generator.series")
                    }}</SelectLabel>
                    <SelectItem
                      v-for="name in Object.keys(seriesMap)"
                      :key="name"
                      :value="name"
                      >{{
                        $t(`pages./logo-generator.seriesNames.${name}`)
                      }}</SelectItem
                    >
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div class="flex items-center gap-2">
                <Switch v-model:checked="isVertical" id="vertical" />
                <Label for="vertical">{{ $t("pages./logo-generator.vertical") }}</Label>
              </div>
            </PopoverContent>
          </Popover>
          <VTooltip>
            <Button @click="onSave" variant="outline" size="icon">
              <Icon name="uil:image-download"></Icon>
            </Button>
            <template #content
              ><p>{{ $t("pages./logo-generator.saveImage") }}</p></template
            >
          </VTooltip>
        </div>
      </div>
    </div>
  </div>
</template>
