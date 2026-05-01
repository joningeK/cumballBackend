import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { tasksTable } from "../../lib/tableClient";
import { v4 as uuidv4 } from "uuid";
import { task } from "../../types/common";
import { requireAdmin } from "../../lib/auth";

app.http("createTask", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "tasks",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const body = await req.json();

      const { title, description, points, isBonus, isReoccuring } =
        body as task;

      const user = requireAdmin(req);
      const teamId = user.teamId;

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
          jsonBody: { error: "points is required" },
        };
      }
      const task = {
        partitionKey: "TASK",
        rowKey: uuidv4(),
        title,
        description: description ?? "",
        points: points ?? 0,
        isBonus: isBonus ?? false,
        isReoccuring: isReoccuring ?? false,
        createdAt: new Date().toISOString(),
      };

      await tasksTable.createEntity(task);

      return {
        status: 201,
        jsonBody: task,
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: {
          error: "Failed to create task",
        },
      };
    }
  },
});
