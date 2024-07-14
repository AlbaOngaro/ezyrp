import { useAuth } from "@clerk/clerk-react";

export function useGetIsAdmin() {
  const { has } = useAuth();
  return has && has({ role: "org:admin" });
}
