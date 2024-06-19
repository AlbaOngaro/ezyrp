import { useAuth, useOrganizationList } from "@clerk/clerk-react";
import { useRouter } from "next/router";
import { PropsWithChildren, useEffect } from "react";
import { Loader } from "components/atoms/loader";

export function OrganisationProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true,
    },
  });
  const { orgId } = useAuth();

  useEffect(() => {
    if (!isLoaded || !!orgId) return;

    if (userMemberships.count === 0) {
      router.push("/onboarding");
      return;
    }

    (async () => {
      await setActive({
        organization: userMemberships?.data?.at(0)?.organization?.id,
      });
    })();
  }, [orgId, isLoaded, setActive, userMemberships, router]);

  if (!isLoaded) {
    return (
      <main className="h-screen w-screen flex justify-center items-center">
        <Loader />
      </main>
    );
  }

  return <>{children}</>;
}
