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
      roles: ["org:admin"],
      // @ts-ignore
      primaryEmailAddress: {
        emailAddress: "test@example.com",
      },
    },
  };
}

type HasArgs =
  | {
      role: string;
      permission?: never;
    }
  | {
      role?: never;
      permission: string;
    };

export function useAdminAuth() {
  return {
    has: ({ role }: HasArgs) => role === "org:admin",
  };
}

export function useMemberAuth() {
  return {
    has: ({ role }: HasArgs) => role === "org:member",
  };
}
