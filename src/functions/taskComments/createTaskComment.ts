import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { commentsTable } from "../../lib/tableClient";
import { v4 as uuidv4 } from "uuid";


app.http("createTaskComment", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "taskComments/{teamId}/{taskId}/{comment}",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {

      const teamId = req.params.teamId;
      const taskId = req.params.taskId;
      const comment = req.params.comment;

      if (!teamId) {
        return {
          status: 400,
          jsonBody: { error: "teamId is required" },
        };
      }

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
