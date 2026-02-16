import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { taskImagesTable } from "../../lib/tableClient";


app.http("deleteTaskImage", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "taskImages/{id}", 
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const id = req.params.id;

      if (!id) {
        return {
          status: 400,
          jsonBody: { error: "id is required" },
        };
      }

      await taskImagesTable.deleteEntity("TASKIMAGE", id);

      return {
        status: 204, // No Content
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: { error: "Failed to delete taskImage" },
      };
    }
  },
});
