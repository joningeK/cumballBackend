import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { tasksTable } from "../lib/tableClient";

app.http("tasksGet", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "tasks",
  handler: async (): Promise<HttpResponseInit> => {
    const tasks: any[] = [];

    for await (const entity of tasksTable.listEntities()) {
      tasks.push(entity);
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