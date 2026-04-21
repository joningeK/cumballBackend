import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { taskImagesTable } from "../../lib/tableClient";
import { requireAuth } from "../../lib/auth";

app.http("getTaskImage", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "taskImages/{taskId}",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const taskId = req.params.taskId;

      const user = requireAuth(req);
      const teamId = user.teamId;
      if (!taskId) {
        return {
          status: 400,
          jsonBody: { error: "id is required" },
        };
      }
      const taskImage = await taskImagesTable.getEntity(teamId, taskId);

      return {
        status: 200,
        jsonBody: taskImage,
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: {
          error:
            "Failed to retrieve taskImage" +
            (error instanceof Error ? ": " + error.message : ""),
        },
      };
    }
  },
});
