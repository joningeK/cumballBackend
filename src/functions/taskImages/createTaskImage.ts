import { app } from "@azure/functions";
import { taskImagesTable, blobService } from "../../lib/tableClient";
import { requireAuth } from "../../lib/auth";

app.http("createTaskImage", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "taskImages",
  handler: async (req) => {
    try {
      const formData = await req.formData();
      const file = formData.get("file");
      const taskId = formData.get("taskId");

      const user = requireAuth(req);
      const teamId = user.teamId;

      if (!(file instanceof File)) {
        return {
          status: 400,
          jsonBody: { error: "Invalid file upload" },
        };
      }

      // Validate file type - only allow images and videos
      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "video/mp4",
        "video/webm",
        "video/quicktime",
        "video/x-msvideo",
      ];

      if (!allowedMimeTypes.includes(file.type)) {
        return {
          status: 400,
          jsonBody: {
            error: "Invalid file type. Only images and videos are allowed.",
          },
        };
      }

      if (typeof taskId !== "string") {
        return {
          status: 400,
          jsonBody: { error: "Invalid taskId" },
        };
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const container = blobService.getContainerClient("task-images");

      const extension = file.name.split(".").pop();

      const blobName = `${teamId}/${taskId}.${extension}`;

      const blockBlob = container.getBlockBlobClient(blobName);

      // 🔥 Slett hvis finnes
      await blockBlob.deleteIfExists();

      // 🔥 Last opp på nytt
      await blockBlob.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: file.type },
      });
      const imageUrl = blockBlob.url;

      // 🔥 UPSERT i stedet for create
      await taskImagesTable.upsertEntity({
        partitionKey: teamId,
        rowKey: taskId,
        imageUrl,
        mediaType: file.type,
        updatedAt: new Date().toISOString(),
      });

      return {
        status: 200,
        jsonBody: {
          imageUrl,
        },
      };
    } catch (error) {
      console.error("🔥 createTaskImage error:", error);

      return {
        status: 500,
        jsonBody: {
          error: "Failed to upload image",
        },
      };
    }
  },
});
