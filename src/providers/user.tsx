import { PropsWithChildren } from "react";
import { useConvexAuth } from "convex/react";
import { Loader } from "components/atoms/loader";

export function UserProvider({ children }: PropsWithChildren) {
  const { isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <main className="h-screen w-screen flex justify-center items-center">
        <Loader />
      </main>
    );
  }

  return <>{children}</>;
}
