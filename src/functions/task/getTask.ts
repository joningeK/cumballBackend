import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { tasksTable } from "../../lib/tableClient";

app.http("getTask", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "tasks/{id}",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    const id = req.params.id;

    if (!id) {
      return {
        status: 400,
        jsonBody: { error: "id is required" },
      };
    }
  
    const task = await tasksTable.getEntity("TASK", id);

    return {
      status: 200,
      jsonBody: {
        count: 1,
        task,
      },
    };
  },
});