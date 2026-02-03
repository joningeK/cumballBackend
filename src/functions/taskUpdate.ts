import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { tasksTable } from "../lib/tableClient";
import { task } from "../types/common";


app.http("tasksUpdate", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "tasks/{id}",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const id = req.params.id;

      if (!id) {
        return {
          status: 400,
          jsonBody: { error: "id is required" },
        };
      }

      const body = await req.json();
      const { title, description, score } = body as task;

      if (!title) {
        return {
          status: 400,
          jsonBody: { error: "title is required" },
        };
      }

      if (!description) {
        return {
          status: 400,
          jsonBody: { error: "description is required" },
        };
      }

      if (typeof score !== "number") {
        return {
          status: 400,
          jsonBody: { error: "score must be a number" },
        };
      }

      const updatedTask = {
        partitionKey: "TASK",
        rowKey: id,
        title,
        description,
        score,
        updatedAt: new Date().toISOString(),
      };

      await tasksTable.updateEntity(updatedTask, "Merge");

      return {
        status: 200,
        jsonBody: updatedTask,
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: { error: "Failed to update task" },
      };
    }
  },
});
