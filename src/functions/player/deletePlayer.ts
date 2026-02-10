import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { playersTable } from "../../lib/tableClient";

app.http("deletePlayer", {
  methods: ["DELETE"],
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

      await playersTable.deleteEntity("PLAYER", id);

      return {
        status: 204, // No Content
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: { error: "Failed to delete player" },
      };
    }
  },
});
