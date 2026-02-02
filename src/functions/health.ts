import { app, HttpRequest, HttpResponseInit } from "@azure/functions";

app.http("health", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (req: HttpRequest): Promise<HttpResponseInit> => {
    return {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
      jsonBody: {
        status: "ok",
        service: "cumball-backend",
        version: "1.0.0",
        time: new Date().toISOString(),
        env: process.env.AZURE_FUNCTIONS_ENVIRONMENT ?? "unknown",
      },
    };
  },
});
