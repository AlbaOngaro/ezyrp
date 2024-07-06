import { UserResource } from "@clerk/types";

type UseUserReturn =
  | {
    isLoaded: false;
    isSignedIn: undefined;
    user: undefined;
  }
  | {
    isLoaded: true;
    isSignedIn: false;
    user: null;
  }
  | {
    isLoaded: true;
    isSignedIn: true;
    user: UserResource;
  };

export function useUser(): UseUserReturn {
  return {
    isLoaded: true,
    isSignedIn: true,
    user: {
      // @ts-ignore
      primaryEmailAddress: {
        emailAddress: "test@example.com",
      },
    },
  };
}
