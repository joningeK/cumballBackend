import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { teamsTable } from "../../lib/tableClient";

app.http("getTeam", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "teams/{id}",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    const id = req.params.id;

    if (!id) {
      return {
        status: 400,
        jsonBody: { error: "id is required" },
      };
    }
  
    const team = await teamsTable.getEntity("TEAM", id);
    return {
      status: 200,
      jsonBody: {
        count: 1,
        team,
      },
    };
  },
});