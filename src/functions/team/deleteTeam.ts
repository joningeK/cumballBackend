import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { teamsTable } from "../../lib/tableClient";
import { requireAdmin } from "../../lib/auth";

app.http("deleteTeam", {
  methods: ["DELETE"],
  authLevel: "anonymous",
  route: "teams/{id}",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const id = req.params.id;

      const user = requireAdmin(req);
      const teamId = user.teamId;

      if (!id) {
        return {
          status: 400,
          jsonBody: { error: "id is required" },
        };
      }

      await teamsTable.deleteEntity("TEAM", id);

      return {
        status: 204, // No Content
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: { error: "Failed to delete team" },
      };
    }
  },
});
