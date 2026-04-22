import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { taskSubmissionsTable } from "../../lib/tableClient";


app.http("deleteTaskSubmission", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "taskSubmissions/{id}", 
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const id = req.params.id;

      if (!id) {
        return {
          status: 400,
          jsonBody: { error: "id is required" },
        };
      }

      await taskSubmissionsTable.deleteEntity("TASKSUBMISSION", id);

      return {
        status: 204, // No Content
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: { error: "Failed to delete taskSubmission" },
      };
    }
  },
});
