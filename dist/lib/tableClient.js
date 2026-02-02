"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasksTable = void 0;
const data_tables_1 = require("@azure/data-tables");
const connectionString = process.env.AzureWebJobsStorage;
exports.tasksTable = data_tables_1.TableClient.fromConnectionString(connectionString, "Tasks");
