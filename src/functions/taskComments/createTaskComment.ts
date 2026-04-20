import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { commentsTable } from "../../lib/tableClient";
import { v4 as uuidv4 } from "uuid";
import { requireAuth } from "../../lib/auth";
app.http("createTaskComment", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "taskComments/{taskId}/{comment}",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const taskId = req.params.taskId;
      const comment = req.params.comment;
      const user = requireAuth(req);
      const teamId = user.teamId;

      if (!taskId) {
        return {
          status: 400,
          jsonBody: { error: "taskId is required" },
        };
      }
      if (!comment) {
        return {
          status: 400,
          jsonBody: { error: "comment is required" },
        };
      }

      const newComment = {
        partitionKey: "TASKCOMMENT",
        rowKey: uuidv4(),
        teamId: teamId,
        taskId: taskId,
        comment: comment,
        createdAt: new Date().toISOString(),
      };

      await commentsTable.createEntity(newComment);

      return {
        status: 201,
        jsonBody: newComment,
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: {
          error: "Failed to create taskComment",
        },
      };
    }
  },
});
