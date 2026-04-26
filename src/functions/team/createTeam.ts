import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { teamsTable } from "../../lib/tableClient";
import { v4 as uuidv4 } from "uuid";
import { team } from "../../types/common";
import { requireAdmin } from "../../lib/auth";

app.http("createTeam", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "teams",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const body = await req.json();

      const { name, username } = body as team;
      const user = requireAdmin(req);
      const teamId = user.teamId;

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

      const team = {
        partitionKey: "TEAM",
        rowKey: uuidv4(),
        name,
        username,
        createdAt: new Date().toISOString(),
      };

      await teamsTable.createEntity(team);

      return {
        status: 201,
        jsonBody: team,
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: {
          error: "Failed to create team",
        },
      };
    }
  },
});
