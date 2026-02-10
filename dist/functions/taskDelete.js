"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@azure/functions");
const tableClient_1 = require("../lib/tableClient");
functions_1.app.http("tasksDelete", {
    methods: ["DELETE"],
    authLevel: "anonymous",
    route: "tasks/{id}",
    handler: async (req) => {
        try {
            const id = req.params.id;
            if (!id) {
                return {
                    status: 400,
                    jsonBody: { error: "id is required" },
                };
            }
            await tableClient_1.tasksTable.deleteEntity("TASK", id);
            return {
                status: 204, // No Content
            };
        }
        catch (error) {
            return {
                status: 500,
                jsonBody: { error: "Failed to delete task" },
            };
        }
    },
});
