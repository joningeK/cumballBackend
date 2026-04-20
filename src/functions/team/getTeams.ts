import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { teamsTable } from "../../lib/tableClient";
import { team } from "../../types/common";
import { requireAuth } from "../../lib/auth";

app.http("getTeams", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "teams",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    const teams: team[] = [];

    const user = requireAuth(req);
    const teamId = user.teamId;

    for await (const entity of teamsTable.listEntities()) {
      const team: team = {
        rowKey: entity.rowKey as string | undefined,
        name: entity.name as string,
      };
      teams.push(team);
    }

    return {
      status: 200,
      jsonBody: {
        count: teams.length,
        teams,
      },
    };
  },
});
