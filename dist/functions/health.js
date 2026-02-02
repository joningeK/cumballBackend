"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@azure/functions");
functions_1.app.http("health", {
    methods: ["GET"],
    authLevel: "anonymous",
    handler: async (req) => {
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
