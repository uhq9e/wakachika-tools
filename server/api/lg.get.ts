import { LogoGenerator, nowayu, kumeyu, wasuyu } from "dearu-logo-generator";
import { ILogoMeta } from "dearu-logo-generator/types/lib/types/shared";
import { z } from "zod";

const seriesMap: Record<string, ILogoMeta> = {
  nowayu,
  kumeyu,
  wasuyu,
};

const queryParams = z.object({
  lines: z
    .string()
    .regex(/^[^,]+,[^,]+$/, {
      message: "Lines format must be `<first line>,<second line>`",
    })
    .default("乃木若葉は,勇者である"),
  series: z
    .string()
    .regex(new RegExp(`^${Object.keys(seriesMap).join("|")}\$`), {
      message: "Invalid series name",
    })
    .default("nowayu"),
  vertical: z.boolean().default(false),
});

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, (params) =>
    queryParams.safeParse(params)
  );

  if (!query.success)
    throw createError({
      statusCode: 400,
      message: query.error.issues.map((issue) => issue.message).join("\n"),
    });

  const lg = new LogoGenerator(
    seriesMap[query.data.series],
    query.data.vertical ? "vertical" : "horizontal"
  );

  const svg = await lg.generate(
    ...(query.data.lines.split(",") as [string, string])
  );

  return new Response(svg.outerHTML, {
    headers: { "content-type": "image/svg+xml" },
  });
});
