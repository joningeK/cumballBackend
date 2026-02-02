import { TableClient } from "@azure/data-tables";

const connectionString = process.env.AzureWebJobsStorage!;

export const tasksTable = TableClient.fromConnectionString(
  connectionString,
  "Tasks"
);