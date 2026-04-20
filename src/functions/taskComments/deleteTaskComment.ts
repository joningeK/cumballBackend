import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { taskStatesTable } from "../../lib/tableClient";
import { requireAuth } from "../../lib/auth";

app.http("deleteTaskComment", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "taskComments/{id}",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const id = req.params.id;
      const user = requireAuth(req);
      const teamId = user.teamId;
      if (!id) {
        return {
          status: 400,
          jsonBody: { error: "id is required" },
        };
      }

      await taskStatesTable.deleteEntity("TASKCOMMENT", id);

      return {
        status: 204, // No Content
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: { error: "Failed to delete taskComment" },
      };
    }
  },
});
