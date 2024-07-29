import { Plan } from "lib/hooks/useGetUserPlan";

export enum Step {
  Workspace,
  Plan,
  TeamMembers,
  Summary,
}

type TeamMember = {
  email: string;
};

export type FormValue = {
  name: string;
  plan: Plan;
  teamMembers: TeamMember[];
};
