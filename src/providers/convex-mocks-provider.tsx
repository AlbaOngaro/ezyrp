import { PropsWithChildren, createContext } from "react";

export const ConvexMocksContext = createContext<{
  cache: Map<string, any>;
}>({
  cache: new Map(),
});

export function ConvexMocksProvider({
  children,
  mocks,
}: PropsWithChildren<{
  mocks: Map<string, any>;
}>) {
  return (
    <ConvexMocksContext.Provider value={{ cache: mocks }}>
      {children}
    </ConvexMocksContext.Provider>
  );
}
