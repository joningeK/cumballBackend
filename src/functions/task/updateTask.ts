import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { tasksTable } from "../../lib/tableClient";
import { task } from "../../types/common";


app.http("updateTask", {
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
      const { title, description, points, isBonus } = body as task;

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

      if (typeof points !== "number") {
        return {
          status: 400,
          jsonBody: { error: "points must be a number" },
        };
      }

      const updatedTask = {
        partitionKey: "TASK",
        rowKey: id,
        title,
        description,
        points,
        isBonus: isBonus ?? false,
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
