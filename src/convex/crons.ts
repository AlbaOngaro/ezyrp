import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.cron(
  "Trigger customer:birthday event every day at 9am",
  "0 9 * * *",
  internal.workflows.recurringtrigger,
  { event: "customer:birthday" },
);

export default crons;
