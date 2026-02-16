import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { taskStatesTable } from "../../lib/tableClient";


app.http("deleteTaskState", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "taskStates/{id}", 
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const id = req.params.id;

      if (!id) {
        return {
          status: 400,
          jsonBody: { error: "id is required" },
        };
      }

      await taskStatesTable.deleteEntity("TASKSTATE", id);

      return {
        status: 204, // No Content
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: { error: "Failed to delete taskStateTable" },
      };
    }
  },
});
