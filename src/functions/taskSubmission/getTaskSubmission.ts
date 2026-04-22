import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { taskSubmissionsTable } from "../../lib/tableClient";
import { requireAuth } from "../../lib/auth";

app.http("getTaskSubmission", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "taskSubmission",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const user = requireAuth(req);
      const teamId = user.teamId;

      const entities = taskSubmissionsTable.listEntities({
        queryOptions: {
          filter: `PartitionKey eq '${teamId}'`,
        },
      });

      const results: any[] = [];

      for await (const entity of entities) {
        results.push(entity);
      }

      return {
        status: 200,
        jsonBody: results,
      };
    } catch (error) {
      console.error("🔥 getTaskSubmissions error:", error);

      return {
        status: 500,
        jsonBody: {
          error: "Failed to get taskSubmissions",
        },
      };
    }
  },
});
