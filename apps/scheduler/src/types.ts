export type Job = {
  id: string;
  type: string;
  status: "completed" | "error" | "pending";
  cron?: string;
};
