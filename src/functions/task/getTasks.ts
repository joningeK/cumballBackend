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
        isReoccuring: entity.isReoccuring as boolean,
        sortOrder: entity.sortOrder as number,
      };
      tasks.push(task);
    }

    // Sort tasks so bonus tasks come first
    tasks.sort((a, b) => {
      if (a.isBonus && !b.isBonus) return -1;
      if (!a.isBonus && b.isBonus) return 1;
      return a.sortOrder - b.sortOrder;
    });

    return {
      status: 200,
      jsonBody: {
        count: tasks.length,
        tasks,
      },
    };
  },
});
