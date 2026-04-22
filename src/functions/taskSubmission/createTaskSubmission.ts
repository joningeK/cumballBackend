import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { taskSubmissionsTable } from "../../lib/tableClient";
import { v4 as uuidv4 } from "uuid";
import { requireAuth } from "../../lib/auth";

import { state } from "../../types/common";

app.http("createTaskSubmission", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "taskSubmission/{taskId}/{state}",
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

      // Check if taskSubmission already exists
      let existingTaskSubmission;
      try {
        existingTaskSubmission = await taskSubmissionsTable.getEntity(
          teamId,
          taskId,
        );
      } catch (error) {
        // Entity doesn't exist, existingTaskSubmission remains undefined
      }

      if (existingTaskSubmission) {
        // Update existing taskSubmission to "pending"
        const updatedTaskSubmission = {
          partitionKey: teamId,
          rowKey: taskId,
          state: "pending",
          updatedAt: new Date().toISOString(),
        };

        await taskSubmissionsTable.updateEntity(updatedTaskSubmission, "Merge");

        return {
          status: 200,
          jsonBody: updatedTaskSubmission,
        };
      } else {
        // Create new taskSubmission
        const taskSubmission = {
          partitionKey: teamId,
          rowKey: taskId,
          state: state,
          createdAt: new Date().toISOString(),
        };

        await taskSubmissionsTable.createEntity(taskSubmission);

        return {
          status: 201,
          jsonBody: taskSubmission,
        };
      }
    } catch (error) {
      return {
        status: 500,
        jsonBody: {
          error: "Failed to create taskSubmission",
        },
      };
    }
  },
});
