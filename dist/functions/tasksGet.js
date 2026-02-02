"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@azure/functions");
const tableClient_1 = require("../lib/tableClient");
functions_1.app.http("tasksGet", {
    methods: ["GET"],
    authLevel: "anonymous",
    route: "tasks",
    handler: async () => {
        const tasks = [];
        // Hent alle entities
        for await (const entity of tableClient_1.tasksTable.listEntities()) {
            tasks.push(entity);
        }
        return {
            status: 200,
            jsonBody: {
                count: tasks.length,
                tasks,
            },
        };
    },
});
