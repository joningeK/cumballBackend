import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { commentsTable } from "../../lib/tableClient";


app.http("updateTaskComment", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "taskComments/{id}/{teamId}/{taskId}/{comment}",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const id = req.params.id;
      const teamId = req.params.teamId;
      const taskId = req.params.taskId;
      const comment = req.params.comment;


      if (!id) {
        return {
          status: 400,
          jsonBody: { error: "id is required" },
        };
      }

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

      const updatedTaskComment = {
        partitionKey: "TASKCOMMENT",
        rowKey: id,
        teamId,
        taskId,
        comment,
        updatedAt: new Date().toISOString(),
      };

      await commentsTable.updateEntity(updatedTaskComment, "Merge");

      return {
        status: 200,
        jsonBody: updatedTaskComment,
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: { error: "Failed to update task comment" },
      };
    }
  },
});
