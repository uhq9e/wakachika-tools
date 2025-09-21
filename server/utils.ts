import { z } from "zod";

export const paginationParams = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(10),
});

export const mainCharacters = [
  "結城 友奈",
  "東郷 美森",
  "犬吠埼 風",
  "犬吠埼 樹",
  "三好 夏凜",
  "鷲尾 須美",
  "三ノ輪 銀",
  "乃木 園子",
  "乃木 若葉",
  "土居 球子",
  "伊予島 杏",
  "郡 千景",
  "高嶋 友奈",
  "白鳥 歌野",
  "乃木 園子",
  "秋原 雪花",
  "古波蔵 棗",
  "上里 ひなた",
  "藤森 水都",
  "赤嶺 友奈",
  "国土 亜耶",
  "楠 芽吹",
  "加賀城 雀",
  "弥勒 夕海子",
  "山伏 しずく",
  "山伏 シズク",
  "弥勒 蓮華",
  "桐生 静",
  "安芸真鈴",
  "花本 美佳",
  "芙蓉 友奈",
  "柚木 友奈",
] as const;

export type MainCharacter = typeof mainCharacters[number];
