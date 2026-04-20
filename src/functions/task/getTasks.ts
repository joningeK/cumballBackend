import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { tasksTable } from "../../lib/tableClient";
import { task } from "../../types/common";
import { requireAuth } from "../../lib/auth";

app.http("getTasks", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "tasks",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    const tasks: task[] = [];
    const user = requireAuth(req);

    for await (const entity of tasksTable.listEntities()) {
      const task: task = {
        taskId: entity.rowKey as string | undefined,
        title: entity.title as string,
        description: entity.description as string,
        points: entity.points as number,
        isBonus: entity.isBonus as boolean,
      };
      tasks.push(task);
    }

    return {
      status: 200,
      jsonBody: {
        count: tasks.length,
        tasks,
      },
    };
  },
});
