import { FunctionReference, OptionalRestArgs } from "convex/server";

import { ReactAction } from "../types";

import { convexMockServer } from "__tests__/__mocks__/convex/server";

export function useAction<Action extends FunctionReference<"action">>(
  action: Action,
): ReactAction<Action> {
  const fn = async (...args: OptionalRestArgs<Action>) => {
    return convexMockServer.action(action, ...args);
  };

  fn.revalidate = async (...args: OptionalRestArgs<Action>) => {
    return convexMockServer.action(action, ...args);
  };

  return fn;
}
