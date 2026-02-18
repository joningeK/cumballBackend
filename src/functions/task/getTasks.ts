import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { tasksTable } from "../../lib/tableClient";
import { task } from "../../types/common";

app.http("getTasks", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "tasks",
  handler: async (): Promise<HttpResponseInit> => {
    const tasks: task[] = [];

    for await (const entity of tasksTable.listEntities()) {
      const task: task = {
        rowKey: entity.rowKey as string | undefined,
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