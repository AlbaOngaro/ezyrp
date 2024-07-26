import { useAuth, useOrganizationList } from "@clerk/clerk-react";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Loader } from "components/atoms/loader";

function isOnboardingRoute(path: string): boolean {
  return path.includes("onboarding") || path.includes("success");
}

export function OrganisationProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const { orgId } = useAuth();
  const searchParams = useSearchParams();

  const __clerk_ticket = searchParams.get("__clerk_ticket");
  const __clerk_status = searchParams.get("__clerk_status");

  const showLoader = useMemo(() => {
    if (!!__clerk_status && !!__clerk_ticket) {
      return false;
    }

    return !isLoaded;
  }, [isLoaded, __clerk_status, __clerk_ticket]);

  useEffect(() => {
    if (!isLoaded || !!orgId) return;

    if (userMemberships.count === 0) {
      if (!isOnboardingRoute(router.asPath)) {
        router.push("/onboarding");
      }
      return;
    }

    (async () => {
      await setActive({
        organization: userMemberships?.data?.at(0)?.organization?.id,
      });
    })();
  }, [orgId, isLoaded, setActive, userMemberships, router]);

  if (showLoader) {
    return (
      <main className="h-screen w-screen flex justify-center items-center">
        <Loader />
      </main>
    );
  }

  return <>{children}</>;
}
