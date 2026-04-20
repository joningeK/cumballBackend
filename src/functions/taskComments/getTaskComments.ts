import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { commentsTable } from "../../lib/tableClient";
import { comment } from "../../types/common";
import { requireAuth } from "../../lib/auth";

app.http("getTaskComments", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "taskcomments/{taskId}",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    const comments: comment[] = [];
    const taskId = req.params.taskId;

    const user = requireAuth(req);

    for await (const entity of commentsTable.listEntities()) {
      if (entity.taskId !== taskId) continue;
      const comment: comment = {
        rowKey: entity.rowKey as string | undefined,
        taskId: entity.taskId as string,
        teamId: entity.teamId as string,
        comment: entity.comment as string,
      };
      comments.push(comment);
    }

    return {
      status: 200,
      jsonBody: {
        count: comments.length,
        comments,
      },
    };
  },
});
