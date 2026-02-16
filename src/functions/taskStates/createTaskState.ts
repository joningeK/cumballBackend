import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { taskStatesTable } from "../../lib/tableClient";
import { v4 as uuidv4 } from "uuid";


app.http("createTaskState", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "taskState/{teamId}/{state}",
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


      const taskState = {
        partitionKey: "TASKSTATE",
        rowKey: uuidv4(),
        teamId: teamId,
        state: state,
        createdAt: new Date().toISOString(),
      };

      await taskStatesTable.createEntity(taskState);

      return {
        status: 201,
        jsonBody: taskState,
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: {
          error: "Failed to create taskState",
        },
      };
    }
  },
});
