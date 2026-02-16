import { TableClient } from "@azure/data-tables";

const connectionString = process.env.AzureWebJobsStorage!;

export const tasksTable = TableClient.fromConnectionString(
  connectionString,
  "Tasks"
);

export const playersTable = TableClient.fromConnectionString(
  connectionString,
  "Players"
);

export const teamsTable = TableClient.fromConnectionString(
  connectionString,
  "Teams"
);

export const taskStatesTable = TableClient.fromConnectionString(
  connectionString,
  "TaskStates"
);


export const commentsTable = TableClient.fromConnectionString(
  connectionString,
  "Comments"
);

export const taskImagesTable = TableClient.fromConnectionString(
  connectionString,
  "TaskImages"
);





