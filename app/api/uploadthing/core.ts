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
    .middleware(async ({ req }) => {
      try {
        logStage("Middleware Start");
        
        // Get auth session
        const { userId } = await auth();
        
        if (!userId) {
          logStage("Middleware Error", { error: "No authenticated session" });
          throw new Error("Unauthorized: No authenticated session");
        }

        // Verify environment variables
        if (!process.env.UPLOADTHING_SECRET || !process.env.UPLOADTHING_APP_ID) {
          logStage("Middleware Error", { error: "Missing UploadThing configuration" });
          throw new Error("Server configuration error: UploadThing not configured");
        }
        
        logStage("Middleware Success", { userId });
        return { userId };
      } catch (error) {
        logStage("Middleware Error", { 
          error: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        logStage("Upload Complete Start", { metadata, file });
        
        if (!metadata.userId) {
          throw new Error("No userId in metadata");
        }
        
        const result = {
          url: file.url,
          name: file.name,
          size: file.size,
          key: file.key
        };
        
        logStage("Upload Complete Success", result);
        return result;
      } catch (error) {
        logStage("Upload Complete Error", { 
          error: error instanceof Error ? error.message : "Unknown error",
          stack: error instanceof Error ? error.stack : undefined
        });
        throw error;
      }
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 