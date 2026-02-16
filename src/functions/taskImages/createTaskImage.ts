import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { taskImagesTable } from "../../lib/tableClient";
import { v4 as uuidv4 } from "uuid";


app.http("createTaskImage", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "taskImages/{teamId}/{image}",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {

      const teamId = req.params.teamId;
      const image = req.params.image;

      if (!teamId) {
        return {
          status: 400,
          jsonBody: { error: "teamId is required" },
        };
      }

      if (!image) {
        return {
          status: 400,
          jsonBody: { error: "image is required" },
        };
      }


      const taskImage = {
        partitionKey: "TASKIMAGE",
        rowKey: uuidv4(),
        teamId: teamId,
        image: image,
        createdAt: new Date().toISOString(),
      };

      await taskImagesTable.createEntity(taskImage);

      return {
        status: 201,
        jsonBody: taskImage,
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: {
          error: "Failed to create taskImage",
        },
      };
    }
  },
});
