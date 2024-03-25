import { z } from "zod";
import { prisma } from "~/server/db";
import { mainCharacters, paginationParams } from "~/server/utils";

export const queryParams = z
  .object({
    keyword: z.string(),
    speaker: z.string().default("__all__"),
  })
  .merge(paginationParams);

export default defineEventHandler(async (event) => {
  const query = await getValidatedQuery(event, (params) =>
    queryParams.safeParse(params)
  );

  if (!query.success)
    throw createError({
      statusCode: 400,
      message: query.error.issues
        .map((issue) => `${issue.path}: ${issue.message}`)
        .join("\n"),
    });

  let speakerArg: Record<string, any> | undefined = undefined;

  switch (query.data.speaker) {
    case "__all__":
      break;

    case "__other__":
      speakerArg = { notIn: mainCharacters };
      break;

    default:
      speakerArg = { equals: query.data.speaker };
      break;
  }

  const lines = await prisma.scenarioLine.findMany({
    where: {
      text: {
        contains: query.data.keyword,
      },
      speaker: speakerArg,
    },
    skip: (query.data.page - 1) * query.data.pageSize,
    take: query.data.pageSize,
  });

  return lines;
});
