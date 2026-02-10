import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { playersTable } from "../../lib/tableClient";
import { v4 as uuidv4 } from "uuid";
import { player } from "../../types/common";


app.http("createPlayer", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "players",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const body = await req.json();

      const { club, name, teamId } = body as player;

      if (!name) {
        return {
          status: 400,
          jsonBody: { error: "name is required" },
        };
      }
      
      const player = {
        partitionKey: "PLAYER",
        rowKey: uuidv4(),
        club: club ?? undefined,
        name,
        teamId: teamId ?? undefined,
        createdAt: new Date().toISOString(),
      };

      await playersTable.createEntity(player);

      return {
        status: 201,
        jsonBody: player,
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: {
          error: "Failed to create player",
        },
      };
    }
  },
});