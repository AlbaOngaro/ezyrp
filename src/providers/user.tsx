import { PropsWithChildren } from "react";
import { useStoreUserEffect } from "hooks/useStoreUserEffect";
import { Loader } from "components/atoms/loader";

export function UserProvider({ children }: PropsWithChildren) {
  const { isLoading } = useStoreUserEffect();

  if (isLoading) {
    return (
      <main className="h-screen w-screen flex justify-center items-center">
        <Loader />
      </main>
    );
  }

  return <>{children}</>;
}
