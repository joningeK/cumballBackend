import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { taskStatesTable } from "../../lib/tableClient";
import { v4 as uuidv4 } from "uuid";
import { requireAuth } from "../../lib/auth";

import { state } from "../../types/common";

app.http("createTaskState", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "taskState/{taskId}/{state}",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const taskId = req.params.taskId;
      const state = req.params.state;

      const user = requireAuth(req);
      const teamId = user.teamId;
      if (!taskId) {
        return {
          status: 400,
          jsonBody: { error: "taskId is required" },
        };
      }

      const taskState = {
        partitionKey: teamId,
        rowKey: taskId,
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
