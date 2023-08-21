import useSWR from "swr";
import { Profile } from "lib/types";

function getProfile() {
  return fetch("/api/profile").then((res) => res.json());
}

export function useProfile() {
  const { data, error, mutate, isLoading } = useSWR<
    Profile,
    unknown,
    "/api/profile"
  >("/api/profile", () => getProfile());

  return {
    data,
    error,
    mutate,
    update: (profile: Partial<Profile>) =>
      mutate(async () => {
        await fetch("/api/profile", {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(profile),
        });

        return getProfile();
      }),
    isLoading,
  };
}
