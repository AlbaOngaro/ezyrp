import { Plan } from "lib/hooks/useGetUserPlan";

export enum Step {
  Workspace,
  Plan,
  Summary,
}

export type FormValue = {
  name: string;
  plan: Plan;
};
