import { PropsWithChildren, createContext } from "react";

export const ConvexCacheContext = createContext<{ cache: Map<string, any> }>({
  cache: new Map(),
});

const cache = new Map<string, any>();

export function ConvexCacheProvider({ children }: PropsWithChildren) {
  return (
    <ConvexCacheContext.Provider value={{ cache }}>
      {children}
    </ConvexCacheContext.Provider>
  );
}
