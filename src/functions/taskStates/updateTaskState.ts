import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { taskStatesTable } from "../../lib/tableClient";
import { requireAuth } from "../../lib/auth";

app.http("updateTaskState", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "taskStates/{teamId}/{taskId}/{state}",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const state = req.params.state;
      const taskId = req.params.taskId;
      const teamId = req.params.teamId;
      const user = requireAuth(req);

      if (!state) {
        return {
          status: 400,
          jsonBody: { error: "state is required" },
        };
      }

      const updatedTaskState = {
        partitionKey: teamId,
        rowKey: taskId,
        state: state,
        updatedAt: new Date().toISOString(),
      };

      await taskStatesTable.updateEntity(updatedTaskState, "Merge");

      return {
        status: 200,
        jsonBody: updatedTaskState,
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: { error: "Failed to update taskstate" },
      };
    }
  },
});
