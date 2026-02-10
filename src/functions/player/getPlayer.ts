import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { playersTable } from "../../lib/tableClient";
import { player } from "../../types/common";


app.http("getPlayer", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "players",
  handler: async (): Promise<HttpResponseInit> => {
    const players: player[] = [];

    for await (const entity of playersTable.listEntities()) {            
      const player: player = {
        rowKey: entity.rowKey as string | undefined,
        name: entity.name as string,
        club: entity.club as string | undefined,
        teamId: entity.teamId as string | undefined,
      };
      players.push(player);      
    }

    return {
      status: 200,
      jsonBody: {
        count: players.length,
        players,
      },
    };
  },
});