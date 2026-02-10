"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@azure/functions");
const tableClient_1 = require("../lib/tableClient");
functions_1.app.http("tasksUpdate", {
    methods: ["PUT"],
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
            const body = await req.json();
            const { title, description, score } = body;
            if (!title) {
                return {
                    status: 400,
                    jsonBody: { error: "title is required" },
                };
            }
            if (!description) {
                return {
                    status: 400,
                    jsonBody: { error: "description is required" },
                };
            }
            if (typeof score !== "number") {
                return {
                    status: 400,
                    jsonBody: { error: "score must be a number" },
                };
            }
            const updatedTask = {
                partitionKey: "TASK",
                rowKey: id,
                title,
                description,
                score,
                updatedAt: new Date().toISOString(),
            };
            await tableClient_1.tasksTable.updateEntity(updatedTask, "Merge");
            return {
                status: 200,
                jsonBody: updatedTask,
            };
        }
        catch (error) {
            return {
                status: 500,
                jsonBody: { error: "Failed to update task" },
            };
        }
    },
});
