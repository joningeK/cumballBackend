import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { taskStatesTable } from "../../lib/tableClient";
import { requireAuth } from "../../lib/auth";

app.http("getTaskStates", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "taskStates",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const user = requireAuth(req);
      const teamId = user.teamId;

      const entities = taskStatesTable.listEntities({
        queryOptions: {
          filter: `PartitionKey eq '${teamId}'`,
        },
      });

      console.log("Fetching task states for team:", teamId);

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
