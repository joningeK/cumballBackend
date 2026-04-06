import { BlobServiceClient } from "@azure/storage-blob";
import { app } from "@azure/functions";
import { taskImagesTable, blobService } from "../../lib/tableClient";

app.http("createTaskImage", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "taskImages",
  handler: async (req) => {
    const formData = await req.formData();
    const file = formData.get("file");
    const taskId = formData.get("taskId");
    const teamId = formData.get("teamId");

    if (!(file instanceof File)) {
      throw new Error("Invalid file upload");
    }

    if (typeof taskId !== "string" || typeof teamId !== "string") {
      throw new Error("Invalid taskId or teamId");
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const container = blobService.getContainerClient("task-images");
    const blobName = `${taskId}/${crypto.randomUUID()}.jpg`;
    const blockBlob = container.getBlockBlobClient(blobName);

    await blockBlob.uploadData(buffer);

    const imageUrl = blockBlob.url;

    // lagre metadata i Table Storage
    await taskImagesTable.createEntity({
      partitionKey: "TASKIMAGES",
      rowKey: teamId + taskId,
      imageUrl,
      createdAt: new Date().toISOString(),
    });

    return {
      status: 200,
      jsonBody: {
        imageUrl,
      },
    };
  },
});
