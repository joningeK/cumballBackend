import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { taskStatesTable } from "../../lib/tableClient";
import { requireAdmin } from "../../lib/auth";

app.http("getTaskStates", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "taskStates",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      console.log("tet");
      const user = requireAdmin(req);
      const teamId = user.teamId;

      const entities = taskStatesTable.listEntities({});

      const results: any[] = [];

      for await (const entity of entities) {
        results.push(entity);
      }

      return {
        status: 200,
        jsonBody: results,
      };
    } catch (error) {
      console.error("🔥 getTaskStates error:", error);

      return {
        status: 500,
        jsonBody: {
          error: "Failed to get taskStates",
        },
      };
    }
  },
});
