import { PropsWithChildren, useMemo } from "react";
import { useConvexAuth } from "convex/react";
import { useSearchParams } from "next/navigation";
import { Loader } from "components/atoms/loader";

export function UserProvider({ children }: PropsWithChildren) {
  const { isLoading } = useConvexAuth();
  const searchParams = useSearchParams();

  const __clerk_ticket = searchParams.get("__clerk_ticket");
  const __clerk_status = searchParams.get("__clerk_status");

  const showLoader = useMemo(() => {
    if (!!__clerk_status && !!__clerk_ticket) {
      return false;
    }

    return isLoading;
  }, [isLoading, __clerk_status, __clerk_ticket]);

  if (showLoader) {
    return (
      <main className="h-screen w-screen flex justify-center items-center">
        <Loader />
      </main>
    );
  }

  return <>{children}</>;
}
