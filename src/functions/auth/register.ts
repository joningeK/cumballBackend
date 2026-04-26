import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { teamsTable } from "../../lib/tableClient";
import bcrypt from "bcryptjs";

app.http("registerTeam", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "auth/register",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const { name, username, password } = (await req.json()) as {
        name: string;
        username: string;
        password: string;
      };

      if (!name || !username || !password) {
        return {
          status: 400,
          jsonBody: { error: "name, username and password required" },
        };
      }

      const existing = teamsTable.listEntities({
        queryOptions: {
          filter: `PartitionKey eq 'TEAM' and username eq '${username}'`,
        },
      });

      for await (const e of existing) {
        return {
          status: 400,
          jsonBody: { error: "Username already exists" },
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const entity = {
        partitionKey: "TEAM",
        rowKey: crypto.randomUUID(),
        name,
        username,
        passwordHash,
        isAdmin: false,
        createdAt: new Date().toISOString(),
      };

      await teamsTable.createEntity(entity);

      return {
        status: 201,
        jsonBody: {
          teamId: entity.rowKey,
          name: entity.name,
          username: entity.username,
        },
      };
    } catch (error) {
      return {
        status: 500,
        jsonBody: { error: "Failed to create team" },
      };
    }
  },
});
