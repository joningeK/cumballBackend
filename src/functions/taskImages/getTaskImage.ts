import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { taskImagesTable } from "../../lib/tableClient";

app.http("getTaskImage", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "taskImages/{taskId}/{teamId}",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const teamId = req.params.teamId;
      const taskId = req.params.taskId;

      if (!teamId) {
        return {
          status: 400,
          jsonBody: { error: "teamId is required" },
        };
      }

      if (!taskId) {
        return {
          status: 400,
          jsonBody: { error: "id is required" },
        };
      }
      const taskImage = await taskImagesTable.getEntity(
        "TASKIMAGES",
        teamId + taskId,
      );

      return {
        status: 200,
        jsonBody: taskImage,
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: {
          error: "Failed to retrieve taskImage",
        },
      };
    }
  },
});
