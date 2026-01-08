import { Client } from "@upstash/workflow";

export const workflow = new Client({ token: process.env.QSTASH_TOKEN! })

// const { workflowRunId } = await client.trigger({
//   url: `http://localhost:3000/api/workflow`,
//   retries: 3,
//   keepTriggerConfig: true,
// });