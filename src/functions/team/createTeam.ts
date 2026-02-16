import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { teamsTable } from "../../lib/tableClient";
import { v4 as uuidv4 } from "uuid";
import { team } from "../../types/common";

app.http("createTeam", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "teams",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const body = await req.json();

      const { name, } = body as team;

      if (!name) {
        return {
          status: 400,
          jsonBody: { error: "name is required" },
        };
      }

      const team = {
        partitionKey: "TEAM",
        rowKey: uuidv4(),
        name,
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
