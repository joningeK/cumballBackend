import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { tasksTable } from "../lib/tableClient";

app.http("tasksDelete", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "tasks/{id}", 
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const id = req.params.id;

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
      return {
        status: 500,
        jsonBody: { error: "Failed to delete task" },
      };
    }
  },
});
