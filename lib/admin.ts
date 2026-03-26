import { prisma } from "@/lib/prisma";

export async function getAppConfig() {
  let config = await prisma.appConfig.findFirst();
  if (!config) {
    config = await prisma.appConfig.create({ data: {} });
  }
  return config;
}
