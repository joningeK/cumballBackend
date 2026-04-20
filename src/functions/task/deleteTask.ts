import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { tasksTable } from "../../lib/tableClient";
import { requireAdmin } from "../../lib/auth";

app.http("deleteTask", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "tasks/{id}",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const id = req.params.id;

      const user = requireAdmin(req);
      const teamId = user.teamId;

      if (!id) {
        return {
          status: 400,
          jsonBody: { error: "id is required" },
        };
      }

      await tasksTable.deleteEntity("TASK", id);

      return {
        status: 204, // No Content
      };
    } catch (error) {
      console.error("Error deleting task:", error);
      return {
        status: 500,
        jsonBody: { error: "Failed to delete task" },
      };
    }
  },
});
