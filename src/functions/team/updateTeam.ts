import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { teamsTable } from "../../lib/tableClient";
import { team } from "../../types/common";
import { requireAdmin } from "../../lib/auth";

app.http("updateTeam", {
  methods: ["PUT"],
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

      const body = await req.json();
      const { name, username } = body as team;

      if (!name) {
        return {
          status: 400,
          jsonBody: { error: "name is required" },
        };
      }
      if (!username) {
        return {
          status: 400,
          jsonBody: { error: "username is required" },
        };
      }

      const updatedTeam = {
        partitionKey: "TEAM",
        rowKey: id,
        name,
        username,
        updatedAt: new Date().toISOString(),
      };

      await teamsTable.updateEntity(updatedTeam, "Merge");

      return {
        status: 200,
        jsonBody: updatedTeam,
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: { error: "Failed to update team" },
      };
    }
  },
});
