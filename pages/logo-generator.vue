<script setup lang="ts">
import {
  LogoGenerator,
  nowayu,
  kumeyu,
  wasuyu,
  uhimi,
  yuyuyu,
} from "dearu-logo-generator";
import type {
  IHighlightRange,
  ILogoMeta,
} from "dearu-logo-generator/types/lib/types/shared";
import { debounce, clone } from "radash";
import { siteHost } from "~/misc";

const { t } = useI18n();

useSeoMeta({
  title: t("pages./logo-generator.title"),
  description: t("pages./logo-generator.description"),
  ogTitle: t("pages./logo-generator.title"),
  ogDescription: t("pages./logo-generator.description"),
  ogImage: `${siteHost}/tools/logo-generator.webp`,
  twitterCard: "summary",
});

const seriesMap: Record<string, ILogoMeta> = {
  yuyuyu,
  wasuyu,
  nowayu,
  kumeyu,
  uhimi,
};

const seriesInitialValues: Record<
  string,
  { firstLine: string; secondLine: string; vertical: boolean; center: boolean }
> = {
  yuyuyu: {
    firstLine: "結城友奈は",
    secondLine: "勇者である",
    vertical: false,
    center: false,
  },
  wasuyu: {
    firstLine: "鷲尾須美は",
    secondLine: "勇者である",
    vertical: false,
    center: false,
  },
  nowayu: {
    firstLine: "乃木若葉は",
    secondLine: "勇者である",
    vertical: false,
    center: false,
  },
  kumeyu: {
    firstLine: "楠 芽吹は",
    secondLine: "勇者である",
    vertical: false,
    center: false,
  },
  uhimi: {
    firstLine: "上里ひなたは",
    secondLine: "巫女である",
    vertical: false,
    center: true,
  },
};

const defaultSeries = "yuyuyu";

const lg = new LogoGenerator(seriesMap[defaultSeries]);

const firstLine = ref(seriesInitialValues[defaultSeries].firstLine);
const secondLine = ref(seriesInitialValues[defaultSeries].secondLine);

const isVertical = ref(seriesInitialValues[defaultSeries].vertical);
const isCentered = ref(seriesInitialValues[defaultSeries].center);

const selectedSeries = ref(defaultSeries);

const currentSeriesMeta = computed(() => seriesMap[selectedSeries.value]);

const customMode = ref(false);
const customMeta = reactive(clone(currentSeriesMeta.value));

const highlightedCells = ref<[line: number, cell: number][]>([
  [1, 0],
  [1, 1],
]);
const highlights = computed(() => {
  const ranges: IHighlightRange[] = [];

  for (const [lineIndex, charIndex] of highlightedCells.value) {
    ranges.push({ line: lineIndex as 0 | 1, start: charIndex, end: charIndex });
  }

  return ranges;
});

let bgImageRendered = false;

async function generate(): Promise<SVGSVGElement> {
  const svgEl = await lg.generate(
    firstLine.value,
    secondLine.value,
    highlights.value,
    isCentered.value
  );
  return svgEl;
}

const onGenerate = debounce(
  { delay: 10 },
  async (oldSelectedSeries: string = selectedSeries.value) => {
    lg.setMeta(customMode.value ? customMeta : seriesMap[selectedSeries.value]);
    lg.setDirection(isVertical.value ? "vertical" : "horizontal");

    if (selectedSeries.value !== oldSelectedSeries) {
      const initials = seriesInitialValues[selectedSeries.value];

      const oldFirstLine = firstLine.value;
      const oldSecondLine = secondLine.value;

      firstLine.value = initials.firstLine;
      secondLine.value = initials.secondLine;

      seriesInitialValues[oldSelectedSeries].firstLine = oldFirstLine;
      seriesInitialValues[oldSelectedSeries].secondLine = oldSecondLine;

      isVertical.value = initials.vertical;
      isCentered.value = initials.center;
    }

    svgEl.value = await generate();
  }
);

const svgEl = ref(await generate());
const svgStr = computed(() => svgEl.value.outerHTML);

async function svgToDataURL(svg: SVGSVGElement): Promise<string> {
  const img = new Image();
  img.src = `data:image/svg+xml;base64,${btoa(svg.outerHTML)}`;

  await img.decode();

  if (!bgImageRendered) {
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  const canvas = document.createElement("canvas");
  canvas.width = svgEl.value.viewBox.baseVal.width;
  canvas.height = svgEl.value.viewBox.baseVal.height;

  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  bgImageRendered = true;

  return canvas.toDataURL("image/png");
}

async function onSave() {
  const a = document.createElement("a");
  a.href = await svgToDataURL(svgEl.value);
  a.download = `${firstLine.value}_${secondLine.value}.${selectedSeries.value}.png`;
  a.click();
}

function onSaveSvg() {
  const a = document.createElement("a");
  a.href = `data:image/svg+xml;base64,${btoa(svgStr.value)}`;
  a.download = `${firstLine.value}_${secondLine.value}.${selectedSeries.value}.svg`;
  a.click();
}

function toggleHighlightHandler(event: MouseEvent) {
  let lineIndex: number | null = null;
  let charIndex: number | null = null;

  let target = event.target as HTMLElement | SVGElement;

  if (!(target as unknown as SVGElement).ownerSVGElement) return null;

  loop: while (target) {
    if (target.id && /[line|char]_\d/.test(target.id)) {
      const [kind, index] = target.id.split("_");
      switch (kind) {
        case "line":
          lineIndex = Number(index);
          break loop;

        case "char":
          charIndex = Number(index);
          break;

        default:
          break;
      }
    }

    if (!target.parentElement) break;
    target = target.parentElement as HTMLElement | SVGElement;
  }

  if (lineIndex !== null && charIndex !== null) {
    if (
      highlightedCells.value.some(
        ([line, char]) => line === lineIndex && char === charIndex
      )
    ) {
      highlightedCells.value = highlightedCells.value.filter(
        ([line, char]) => line !== lineIndex || char !== charIndex
      );
    } else {
      highlightedCells.value = [
        ...highlightedCells.value,
        [lineIndex, charIndex],
      ];
    }
  }
}

function onBackgroundImageChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    customMeta.backgroundImage = reader.result as string;
  };

  reader.readAsDataURL(file);
}

watch(
  [
    selectedSeries,
    firstLine,
    secondLine,
    isVertical,
    isCentered,
    highlights,
    customMeta,
  ],
  ([], [oss]) => onGenerate(oss)
);

watch(customMode, (v) => {
  if (v) {
    Object.assign(customMeta, clone(seriesMap[selectedSeries.value]), {
      offsetMainAxis: 0,
      offsetCrossAxis: 0,
    });
  }
  onGenerate();
});
</script>

<template>
  <div class="size-full flex flex-col">
    <ToolTitle>{{ $t("pages./logo-generator.title") }}</ToolTitle>
    <div class="grow flex flex-col justify-center items-center gap-4">
      <div class="text-xs text-stone-400">
        {{ $t("pages./logo-generator.highlightHint") }}
      </div>
      <div
        :class="[
          'flex justify-center items-center w-full',
          isVertical ? '*:h-[65vh]' : '*:h-[300px] sm:*:h-[405px]',
        ]"
        v-html="svgStr"
        @click="toggleHighlightHandler"
      ></div>
      <div class="flex flex-col items-center gap-3">
        <div class="flex flex-col gap-1.5 w-full">
          <Label for="select_series">
            {{ $t("pages./logo-generator.series") }}
          </Label>
          <Select v-model="selectedSeries" :disabled="customMode">
            <SelectTrigger id="select_series">
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
        </div>
        <div class="flex flex-col items-end sm:flex-row gap-3 w-full">
          <div class="flex flex-col gap-1.5 grow w-full sm:w-auto">
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
          <div class="flex flex-col gap-1.5 grow w-full sm:w-auto">
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
                <div class="flex items-center gap-2">
                  <Switch v-model:checked="isVertical" id="vertical" />
                  <Label for="vertical">{{
                    $t("pages./logo-generator.vertical")
                  }}</Label>
                </div>
                <div class="flex items-center gap-2">
                  <Switch v-model:checked="isCentered" id="center" />
                  <Label for="center">{{
                    $t("pages./logo-generator.center")
                  }}</Label>
                </div>
                <div class="flex items-center gap-2">
                  <Checkbox v-model:checked="customMode" id="custom_mode" />
                  <Label for="custom_mode">{{
                    $t("pages./logo-generator.customMode")
                  }}</Label>
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
            <VTooltip>
              <Button @click="onSaveSvg" variant="outline" size="icon">
                <Icon name="uil:file-download-alt"></Icon>
              </Button>
              <template #content
                ><p>{{ $t("pages./logo-generator.saveImageSVG") }}</p></template
              >
            </VTooltip>
          </div>
        </div>
        <div v-if="customMode" class="bg-card rounded-md shadow-md p-3 mb-12">
          <div class="font-bold mb-3">
            {{ $t("pages./logo-generator.customMode") }}
          </div>
          <div
            v-if="customMeta"
            class="grid grid-cols-2 gap-2 w-full *:flex *:flex-col *:gap-1.5"
          >
            <div>
              <Label for="background_image">{{
                $t("pages./logo-generator.backgroundImage")
              }}</Label>
              <input
                type="file"
                id="background_image"
                accept="image/*"
                @change="onBackgroundImageChange"
              />
            </div>
            <div>
              <Label for="outline_color">{{
                $t("pages./logo-generator.outlineColor")
              }}</Label>
              <input
                v-model="customMeta.outlineColor"
                type="color"
                id="outline_color"
              />
            </div>
            <div>
              <Label for="background_box_color">{{
                $t("pages./logo-generator.backgroundBoxColor")
              }}</Label>
              <input
                v-model="customMeta.backgroundBoxColor"
                type="color"
                id="background_box_color"
              />
            </div>
            <div>
              <Label for="foreground_box_color">{{
                $t("pages./logo-generator.foregroundBoxColor")
              }}</Label>
              <input
                v-model="customMeta.foregroundBoxColor"
                type="color"
                id="foreground_box_color"
              />
            </div>
            <div>
              <Label for="text_color">{{
                $t("pages./logo-generator.textColor")
              }}</Label>
              <input
                v-model="customMeta.textColor"
                type="color"
                id="text_color"
              />
            </div>
            <div>
              <Label for="text_highlight_color">{{
                $t("pages./logo-generator.textHighlightColor")
              }}</Label>
              <input
                v-model="customMeta.textHighlightColor"
                type="color"
                id="text_highlight_color"
              />
            </div>
            <div>
              <Label for="offset_main_axis">{{
                $t("pages./logo-generator.offsetMainAxis")
              }}</Label>
              <Slider
                :model-value="[customMeta.offsetMainAxis ?? 0]"
                @update:model-value="(v) => customMeta.offsetMainAxis = v![0]"
                :min="-1"
                :max="1"
                :step="0.01"
              />
            </div>
            <div>
              <Label for="offset_cross_axis">{{
                $t("pages./logo-generator.offsetCrossAxis")
              }}</Label>
              <Slider
                :model-value="[customMeta.offsetCrossAxis ?? 0]"
                @update:model-value="(v) => customMeta.offsetCrossAxis = v![0]"
                :min="-1"
                :max="1"
                :step="0.01"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
