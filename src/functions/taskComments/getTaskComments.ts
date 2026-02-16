import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { commentsTable } from "../../lib/tableClient";
import { comment  } from "../../types/common";

app.http("getTaskComments", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "taskcomments/{taskId}",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    const comments: comment[] = [];
    const taskId = req.params.taskId;
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