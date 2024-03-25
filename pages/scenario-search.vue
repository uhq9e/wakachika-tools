<script setup lang="ts">
import type { LocationQueryValue } from "vue-router";
import { mainCharacters, type MainCharacter } from "~/server/utils";

export type SpeakerKind = "__all__" | MainCharacter | "__other__";

export interface ISearchItem {
  id: number;
  fileId: string;
  location: string;
  speaker: string;
  voiceId: string;
  text: string;
}

export interface ISpeakerCount {
  speaker: string;
  _count: number;
}

const { t } = useI18n();

useSeoMeta({
  title: t("pages./scenario-search.title"),
  description: t("pages./scenario-search.description"),
});

const route = useRoute();

const page = ref(1);
const pageSize = ref(10);

const keyword = ref((route.query.keyword as LocationQueryValue) || "");
const speaker = ref<SpeakerKind>("__all__");

const counts = ref<ISpeakerCount[] | null>(null);
const lines = ref<ISearchItem[] | null>(null);

const loading = ref(false);

const menuOptions = computed(() =>
  buildCharacterSelectMenuOptions(counts.value || [])
);

const currentSpeaker = computed(() =>
  menuOptions.value.find((o) => o.value === speaker.value)
);

if (keyword.value.length) await runFetch();

async function runFetch(onlySearch = false) {
  loading.value = true;
  const responses = await Promise.all([
    onlySearch ||
      $fetch<ISpeakerCount[]>("/api/scenario-search/count", {
        query: {
          keyword: keyword.value,
        },
      }),
    $fetch<ISearchItem[]>("/api/scenario-search/search", {
      query: {
        keyword: keyword.value,
        speaker: speaker.value,
        page: page.value,
        pageSize: pageSize.value,
      },
    }),
  ]);
  counts.value =
    typeof responses[0] !== "boolean" ? responses[0] : counts.value;
  lines.value = responses[1];

  loading.value = false;
}

function buildCharacterSelectMenuOptions(counts: ISpeakerCount[]): {
  label: string;
  value: SpeakerKind;
  count: number;
}[] {
  const totalCount = counts.reduce((a, b) => a + b._count, 0);
  const othersCount = counts
    .filter((c) => !mainCharacters.includes(c.speaker))
    .reduce((a, b) => a + b._count, 0);

  const result = [
    { label: "全部", value: "__all__" as SpeakerKind, count: totalCount },
    ...counts
      .filter((c) => mainCharacters.includes(c.speaker))
      .map((c) => ({
        label: c.speaker,
        value: c.speaker as MainCharacter,
        count: c._count,
      })),
  ];

  if (othersCount)
    result.push({
      label: "多人 / 其他",
      value: "__other__",
      count: othersCount,
    });

  return result;
}

function onSpeakerChange(value: SpeakerKind) {
  speaker.value = value;
  page.value = 1;
  runFetch(true);
}

function onPageChange(value: number) {
  page.value = value;
  runFetch(true);
}
</script>

<template>
  <div class="size-full flex flex-col">
    <ToolTitle>{{ $t("pages./scenario-search.title") }}</ToolTitle>
    <div class="grow flex flex-col justify-center items-center gap-4">
      <div class="flex gap-2 w-full max-w-2xl">
        <Input
          v-model="keyword"
          :placeholder="$t('pages./scenario-search.inputPlaceholder')"
          @keyup.enter="keyword.length && runFetch()"
        />
        <Button
          @click="runFetch()"
          :disabled="loading || !keyword.length"
          size="icon"
        >
          <Icon
            v-if="loading"
            name="lucide:loader-circle"
            class="animate-spin"
          />
          <Icon v-else name="uil:search" />
        </Button>
      </div>
      <Transition>
        <div
          v-if="counts"
          class="flex flex-col sm:flex-row gap-2 w-full max-w-7xl mb-12"
        >
          <div class="flex-none flex flex-col gap-1 sm:w-48 md:w-64">
            <div
              v-for="option in menuOptions"
              :key="option.value"
              :class="[
                'flex items-center whitespace-nowrap cursor-pointer px-2 py-1 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground',
                { 'bg-accent': speaker === option.value },
              ]"
              @click="speaker !== option.value && onSpeakerChange(option.value)"
            >
              <span class="text-sm font-medium grow">{{ option.label }}</span>
              <Badge>{{ option.count }}</Badge>
            </div>
          </div>
          <div class="grow flex flex-col items-center gap-2">
            <div
              class="w-full grid grid-cols-1 md:grid-cols-2 auto-rows-min items-start gap-2 relative"
            >
              <ScenarioLineItem
                v-for="line in lines"
                :key="line.id"
                :line="line"
              />
              <Skeleton v-if="loading" class="absolute inset-0" />
            </div>
            <Pagination
              v-if="currentSpeaker && currentSpeaker.count"
              :page="page"
              @update:page="onPageChange"
              v-slot="{ page }"
              :total="currentSpeaker.count"
              :items-per-page="pageSize"
              :sibling-count="1"
              show-edges
              :default-page="1"
            >
              <PaginationList
                v-slot="{ items }"
                class="flex items-center gap-1"
              >
                <PaginationFirst />
                <PaginationPrev />

                <template v-for="(item, index) in items">
                  <PaginationListItem
                    v-if="item.type === 'page'"
                    :key="index"
                    :value="item.value"
                    as-child
                  >
                    <Button
                      class="w-9 h-9 p-0"
                      :variant="item.value === page ? 'default' : 'outline'"
                    >
                      {{ item.value }}
                    </Button>
                  </PaginationListItem>
                  <PaginationEllipsis v-else :key="item.type" :index="index" />
                </template>

                <PaginationNext />
                <PaginationLast />
              </PaginationList>
            </Pagination>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active {
  transition-property: transform, opacity;
  transition-duration: 0.5s;
  transition-timing-function: cubic-bezier(0.17, 0.84, 0.44, 1);
}

.v-leave-active {
  transition-property: transform, opacity;
  transition-duration: 0.25s;
  transition-timing-function: ease-in;
}

.v-enter-from,
.v-leave-to {
  transform: translateY(50px);
  opacity: 0;
}
</style>
