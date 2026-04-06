import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { teamsTable } from "../../lib/tableClient";
import bcrypt from "bcryptjs";

app.http("registerTeam", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "auth/register",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const { name, password } = (await req.json()) as {
        name: string;
        password: string;
      };

      if (!name || !password) {
        return {
          status: 400,
          jsonBody: { error: "name and password required" },
        };
      }

      const existing = teamsTable.listEntities({
        queryOptions: {
          filter: `PartitionKey eq 'TEAM' and name eq '${name}'`,
        },
      });

      for await (const e of existing) {
        return {
          status: 400,
          jsonBody: { error: "Team already exists" },
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const entity = {
        partitionKey: "TEAM",
        rowKey: crypto.randomUUID(),
        name,
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
