import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { tasksTable } from "../lib/tableClient";
import { v4 as uuidv4 } from "uuid";
import { task } from "../types/common";


app.http("tasksCreate", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "tasks",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
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
          jsonBody: { error: "score is required" },
        };
      }
      const task = {
        partitionKey: "TASK",
        rowKey: uuidv4(),
        title,
        description: description ?? "",
        score: score ?? 0,
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
