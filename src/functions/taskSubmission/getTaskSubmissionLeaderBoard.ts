import { app, HttpRequest, HttpResponseInit } from "@azure/functions";
import {
  taskSubmissionsTable,
  tasksTable,
  teamsTable,
} from "../../lib/tableClient";
import { requireAuth } from "../../lib/auth";

app.http("getTaskSubmissionLeaderBoard", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "taskSubmission/leaderboard",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    try {
      const user = requireAuth(req);

      // Get all submissions and filter for approved
      const allSubmissions = taskSubmissionsTable.listEntities({});
      const submissions: any[] = [];
      for await (const entity of allSubmissions) {
        if (entity.state === "approved") {
          submissions.push(entity);
        }
      }

      // Get all tasks for points lookup
      const allTasks = tasksTable.listEntities({});
      const tasksMap: Record<string, number> = {};
      for await (const task of allTasks) {
        const rowKey = task.rowKey as string;
        tasksMap[rowKey] = (task as any).points || 1;
      }

      // Get all teams for name lookup
      const allTeams = teamsTable.listEntities({});
      const teamsList: any[] = [];
      const teamsMap: Record<string, any> = {};
      for await (const team of allTeams) {
        const rowKey = team.rowKey as string;
        teamsList.push(team);
        teamsMap[rowKey] = team;
      }

      // Calculate points per team
      const teamPoints: Record<string, number> = {};
      for (const submission of submissions) {
        const teamId = submission.partitionKey as string;
        const taskId = submission.rowKey as string;
        const points = tasksMap[taskId] || 0;

        teamPoints[teamId] = (teamPoints[teamId] || 0) + points;
      }

      // Build result with ALL teams (including those with 0 points)
      const results = teamsList.map((team) => {
        const teamId = team.rowKey as string;
        return {
          teamId,
          name: teamsMap[teamId]?.name || "Ukjent",
          totalPoints: teamPoints[teamId] || 0,
        };
      });

      // Sort by points descending
      results.sort((a, b) => b.totalPoints - a.totalPoints);

      return {
        status: 200,
        jsonBody: results,
      };
    } catch (error) {
      console.error("🔥 getTaskSubmissionLeaderBoard error:", error);

      return {
        status: 500,
        jsonBody: {
          error: "Failed to get leaderboard",
        },
      };
    }
  },
});
