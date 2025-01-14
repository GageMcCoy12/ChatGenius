import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function currentProfile() {
  const user = await currentUser();

  if (!user?.id) {
    return null;
  }

  const profile = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  return profile;
} 