import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { taskStatesTable } from "../../lib/tableClient";


app.http("updateTaskState", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "taskStates/{teamId}/{state}",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {

      const teamId = req.params.teamId;
      const state = req.params.state;

      if (!teamId) {
        return {
          status: 400,
          jsonBody: { error: "teamId is required" },
        };
      }

      if (!state) {
        return {
          status: 400,
          jsonBody: { error: "state is required" },
        };
      }

      const updatedTaskState = {
        partitionKey: "TASKSTATE",
        rowKey: teamId,
        teamId,
        state,
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
