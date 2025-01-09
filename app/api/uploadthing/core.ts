import { createUploadthing, type FileRouter } from "uploadthing/next";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const f = createUploadthing();

const auth = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
};

export const ourFileRouter = {
  messageAttachment: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
    pdf: { maxFileSize: "8MB", maxFileCount: 1 },
    blob: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    .input(z.object({ messageId: z.string() }))
    .middleware(async ({ input }) => {
      const user = await auth();
      return { userId: user.id, messageId: input.messageId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        const fileSizeInBytes = typeof file.size === 'string' 
          ? parseInt(file.size) * 1024 * 1024  // Convert MB to bytes
          : file.size;

        if (metadata.messageId === 'temp') {
          return { url: file.url };
        }

        const attachment = await prisma.messageAttachment.create({
          data: {
            messageId: metadata.messageId,
            fileName: file.name,
            fileType: file.type,
            fileSize: fileSizeInBytes,
            fileUrl: file.url,
          },
        });

        return { url: file.url };
      } catch (error) {
        console.error("Error creating attachment:", error);
        throw new Error("Failed to create attachment");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 