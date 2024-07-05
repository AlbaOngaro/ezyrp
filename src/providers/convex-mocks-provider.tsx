import { FunctionReference } from "convex/server";
import { PropsWithChildren, createContext } from "react";

export const ConvexMocksContext = createContext<{
  mocks: Map<string | FunctionReference<"mutation">, any>;
}>({
  mocks: new Map(),
});

export function ConvexMocksProvider({
  children,
  mocks,
}: PropsWithChildren<{
  mocks: Map<string, any>;
}>) {
  return (
    <ConvexMocksContext.Provider value={{ mocks }}>
      {children}
    </ConvexMocksContext.Provider>
  );
}
