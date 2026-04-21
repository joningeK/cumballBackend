import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { taskImagesTable } from "../../lib/tableClient";
import { requireAdmin } from "../../lib/auth";

app.http("getTaskImageAdmin", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "taskImagesAdmin",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const user = requireAdmin(req);

      const entities = taskImagesTable.listEntities({});

      const results: any[] = [];

      for await (const entity of entities) {
        results.push(entity);
      }

      return {
        status: 200,
        jsonBody: results,
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: {
          error: "Failed to retrieve taskImageAdmin",
        },
      };
    }
  },
});
