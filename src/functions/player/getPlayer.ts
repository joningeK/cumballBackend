import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { playersTable } from "../../lib/tableClient";

app.http("getPlayer", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "players/{id}",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    const id = req.params.id;

    if (!id) {
      return {
        status: 400,
        jsonBody: { error: "id is required" },
      };
    }
  
    const player = await playersTable.getEntity("PLAYER", id);
    return {
      status: 200,
      jsonBody: {
        count: 1,
        player,
      },
    };
  },
});