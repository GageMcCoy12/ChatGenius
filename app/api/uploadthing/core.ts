import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";
 
const f = createUploadthing();

// Helper to log each stage
const logStage = (stage: string, data?: any) => {
  console.log(`\n=== UploadThing ${stage} ===`);
  if (data) console.log(JSON.stringify(data, null, 2));
  console.log("========================\n");
};

export const ourFileRouter = {
  messageAttachment: f({
    image: { maxFileSize: "16MB" },
    pdf: { maxFileSize: "16MB" },
    video: { maxFileSize: "16MB" }
  })
    .middleware(async () => {
      try {
        logStage("Middleware Start");
        
        // Verify environment variables
        if (!process.env.UPLOADTHING_SECRET || !process.env.UPLOADTHING_APP_ID) {
          throw new Error("UploadThing environment variables not configured");
        }
        
        const session = await auth();
        if (!session || !session.userId) {
          logStage("Middleware Error", "No authenticated session found");
          throw new Error("Unauthorized: No authenticated session");
        }
        
        logStage("Middleware Success", { userId: session.userId });
        return { userId: session.userId };
      } catch (error) {
        logStage("Middleware Error", error);
        throw error;
      }
    })
    .onUploadComplete(({ metadata, file }) => {
      logStage("Upload Complete Start", { metadata, fileUrl: file.url });
      
      if (!metadata.userId) {
        throw new Error("No userId in metadata");
      }
      
      const result = {
        url: file.url,
        name: file.name
      };
      
      logStage("Upload Complete Success", result);
      return result;
    })
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter; 