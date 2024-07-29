import { Plan } from "lib/hooks/useGetUserPlan";

export const PRICES: Record<Plan, number> = {
  free: 0,
  pro: 15,
};

export const STEPS = [
  {
    key: "workspace",
    title: "Workspace",
    description: "Pick a workspace name",
  },
  {
    key: "plan",
    title: "Billing",
    description: "Setup your billing plan",
  },
  {
    key: "teamMembers",
    title: "Team Members",
    description: "Add your team members",
  },
  {
    key: "summary",
    title: "Summary",
    description: "Review and finish",
  },
];
