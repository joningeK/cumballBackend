import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { teamsTable } from "../../lib/tableClient";
import { team } from "../../types/common";
app.http("getTeam", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "team",
  handler: async (): Promise<HttpResponseInit> => {
    const teams: team[] = [];

    for await (const entity of teamsTable.listEntities()) {
      const team: team = {
        rowKey: entity.rowKey as string | undefined,
        name: entity.name as string
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