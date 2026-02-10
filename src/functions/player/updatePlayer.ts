import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { playersTable } from "../../lib/tableClient";
import { player } from "../../types/common";


app.http("updatePlayer", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "players/{id}",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const id = req.params.id;

      if (!id) {
        return {
          status: 400,
          jsonBody: { error: "id is required" },
        };
      }

      const body = await req.json();
      const { club, name, teamId } = body as player;

      if (!name) {
        return {
          status: 400,
          jsonBody: { error: "name is required" },
        };
      }


      const updatedPlayer = {
        partitionKey: "PLAYER",
        rowKey: id,
        club,
        name,
        teamId,

        updatedAt: new Date().toISOString(),
      };

      await playersTable.updateEntity(updatedPlayer, "Merge");

      return {
        status: 200,
        jsonBody: updatedPlayer,
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: { error: "Failed to update player" },
      };
    }
  },
});
