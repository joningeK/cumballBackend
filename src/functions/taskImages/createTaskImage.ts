import { app } from "@azure/functions";
import { taskImagesTable, blobService } from "../../lib/tableClient";
import { requireAuth } from "../../lib/auth";
import exifr from "exifr";

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

      if (typeof taskId !== "string") {
        return {
          status: 400,
          jsonBody: { error: "Invalid taskId" },
        };
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      // 📷 Les EXIF-data
      let capturedAt: string | null = null;
      let cameraModel: string | null = null;
      let phoneMake: string | null = null;
      let latitude: number | null = null;
      let longitude: number | null = null;

      try {
        const exif = await exifr.parse(buffer);

        if (exif?.DateTimeOriginal instanceof Date) {
          capturedAt = exif.DateTimeOriginal.toISOString();
        }
      } catch (err) {
        console.warn("Could not read EXIF metadata:", err);
      }

      const container = blobService.getContainerClient("task-images");

      const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

      const blobName = `${teamId}/${taskId}.${extension}`;
      const blockBlob = container.getBlockBlobClient(blobName);

      // Slett eksisterende fil
      await blockBlob.deleteIfExists();

      // Last opp ny fil
      await blockBlob.uploadData(buffer, {
        blobHTTPHeaders: {
          blobContentType: file.type,
        },
      });

      const imageUrl = blockBlob.url;

      const uploadedAt = new Date().toISOString();

      // Lagre metadata
      await taskImagesTable.upsertEntity({
        partitionKey: teamId,
        rowKey: taskId,

        imageUrl,
        capturedAt,

        updatedAt: uploadedAt,
      });

      return {
        status: 200,
        jsonBody: {
          imageUrl,
          capturedAt,
          uploadedAt,
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
