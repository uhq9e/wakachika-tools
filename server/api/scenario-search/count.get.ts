import { prisma } from "~/server/db";
import { queryParams } from "./search.get";

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

  const eachCounts = await prisma.scenarioLine.groupBy({
    by: ["speaker"],
    _count: true,
    where: {
      text: {
        contains: query.data.keyword,
      },
    },
    orderBy: {
      _count: {
        speaker: "desc",
      },
    },
  });

  return eachCounts;
});
