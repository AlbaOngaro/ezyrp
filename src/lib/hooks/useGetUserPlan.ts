import { useQuery } from "./useQuery";
import { plan } from "convex/schema";
import { api } from "convex/_generated/api";

export type Plan = typeof plan.type;

export function useGetUserPlan(): Plan | undefined {
  const { data: user } = useQuery(api.users.whoami);
  return user?.plan;
}
