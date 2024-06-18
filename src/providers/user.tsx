import { PropsWithChildren } from "react";
import { useStoreUserEffect } from "hooks/useStoreUserEffect";

export function UserProvider({ children }: PropsWithChildren) {
  useStoreUserEffect();

  return <>{children}</>;
}
