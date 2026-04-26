import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import { teamsTable } from "../../lib/tableClient";
import bcrypt from "bcryptjs";
import { player, team, teamRequest } from "../../types/common";
import jwt from "jsonwebtoken";

app.http("login", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "auth/login",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const body = await req.json();

      const { username, password } = body as teamRequest;

      if (!username || !password) {
        return {
          status: 400,
          jsonBody: { error: "Missing credentials" },
        };
      }

      const entities = teamsTable.listEntities({
        queryOptions: {
          filter: `PartitionKey eq 'TEAM' and username eq '${username}'`,
        },
      });

      let team: any = null;

      for await (const e of entities) {
        team = e;
        break;
      }

      if (!team) {
        return {
          status: 401,
          jsonBody: { error: "Invalid credentials" },
        };
      }

      const isValid = await bcrypt.compare(password, team.passwordHash);

      if (!isValid) {
        return {
          status: 401,
          jsonBody: { error: "Invalid credentials" },
        };
      }

      const token = jwt.sign(
        {
          teamId: team.rowKey,
          isAdmin: team.isAdmin,
        },
        "super_secret_key",
        { expiresIn: "7d" },
      );

      return {
        status: 200,
        jsonBody: {
          teamId: team.rowKey,
          username: team.username,
          name: team.name,
          isAdmin: team.isAdmin,
          token,
        },
      };
    } catch (err) {
      return {
        status: 500,
        jsonBody: { error: "Login failed" },
      };
    }
  },
});
