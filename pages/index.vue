<script setup lang="ts">
import { siteHost } from "~/misc";

const { t } = useI18n();
const localePath = useLocalePath();

useSeoMeta({
  title: t("pages./.title"),
  description: t("pages./.description"),
  ogTitle: t("pages./.title"),
  ogDescription: t("pages./.description"),
  ogImage: `${siteHost}/tools/logo-generator.webp`,
  twitterCard: "summary",
});

const toolItems = [
  {
    title: t("pages./logo-generator.title"),
    description: t("pages./logo-generator.description"),
    imageSrc: `${siteHost}/tools/logo-generator.svg`,
    imageAlt: "Logo Generator",
    href: localePath("/logo-generator"),
  },
  {
    title: t("pages./scenario-search.title"),
    description: t("pages./scenario-search.description"),
    href: localePath("/scenario-search"),
  },
];
</script>

<template>
  <main class="flex justify-center">
    <div class="flex flex-col items-center gap-4 max-w-xl *:w-full">
      <nav
        class="flex flex-wrap gap-2 justify-between items-center p-4 bg-card border rounded-lg"
      >
        <div>
          <span class="text-xl mr-1 font-semibold">{{
            $t("pages./.navTitle")
          }}</span>
          <sub>{{ $t("pages./.navTitleSub") }}</sub>
        </div>
        <div class="flex gap-2">
          <LanguageSelect class="w-auto" />
          <NuxtLink to="https://wakachika.love">
            <VTooltip>
              <Button variant="outline" size="icon">
                <Icon name="uil:mountains-sun" />
              </Button>

              <template #content
                ><p>{{ $t("pages./.mainSite") }}</p></template
              >
            </VTooltip>
          </NuxtLink>
        </div>
      </nav>
      <NuxtLink v-for="item in toolItems" :key="item.title" :to="item.href">
        <ToolItem
          :item-title="item.title"
          :description="item.description"
          :image-src="item.imageSrc"
          :image-alt="item.imageAlt"
        />
      </NuxtLink>
    </div>
  </main>
</template>
