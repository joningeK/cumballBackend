"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@azure/functions");
const tableClient_1 = require("../lib/tableClient");
const uuid_1 = require("uuid");
functions_1.app.http("tasksCreate", {
    methods: ["POST"],
    authLevel: "anonymous",
    route: "tasks",
    handler: async (req) => {
        try {
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
                    jsonBody: { error: "score is required" },
                };
            }
            const task = {
                partitionKey: "TASK",
                rowKey: (0, uuid_1.v4)(),
                title,
                description: description ?? "",
                score: score ?? 0,
                createdAt: new Date().toISOString(),
            };
            await tableClient_1.tasksTable.createEntity(task);
            return {
                status: 201,
                jsonBody: task,
            };
        }
        catch (error) {
            return {
                status: 500,
                jsonBody: {
                    error: "Failed to create task",
                },
            };
        }
    },
});
