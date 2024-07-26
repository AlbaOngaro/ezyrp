import { useAction as useConvexAction } from "convex/react";
import {
  FunctionReference,
  FunctionReturnType,
  OptionalRestArgs,
  getFunctionName,
} from "convex/server";
import { useContext } from "react";
import { ReactAction } from "./types";
import { ConvexCacheContext } from "providers/convex-cache";

/**
 * This hook is a wrapper around `useAction` from `convex/react` that adds caching.
 */
export function useAction<Action extends FunctionReference<"action">>(
  action: Action,
): ReactAction<Action> {
  const { cache } = useContext(ConvexCacheContext);

  const performAction = useConvexAction(action);

  const fn = async (...args: OptionalRestArgs<Action>) => {
    const key = `${getFunctionName(action)}:${JSON.stringify(args || {})}`;
    const value = cache.get(key) || null;

    if (value) {
      return value as FunctionReturnType<Action>;
    }

    const result = await performAction(...args);
    cache.set(key, result);

    return result;
  };

  fn.revalidate = async (...args: OptionalRestArgs<Action>) => {
    const key = `${getFunctionName(action)}:${JSON.stringify(args || {})}`;
    const result = await performAction(...args);
    cache.set(key, result);
    return result;
  };

  return fn;
}
