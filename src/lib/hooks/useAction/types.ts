import {
  FunctionReference,
  FunctionReturnType,
  OptionalRestArgs,
} from "convex/server";

export interface ReactAction<Action extends FunctionReference<"action">> {
  /**
   * Execute the action on the server (only when cache is not hit), returning a `Promise` of its return value.
   *
   * @param args - Arguments for the mutation to pass up to the server.
   * @returns The return value of the server-side function call.
   */
  (...args: OptionalRestArgs<Action>): Promise<FunctionReturnType<Action>>;

  /**
   * Execute the action on the server skipping cache check and revalidating it.
   * Returns a `Promise` of its return value.
   *
   * @param args - Arguments for the mutation to pass up to the server.
   * @returns The return value of the server-side function call.
   */
  revalidate(
    ...args: OptionalRestArgs<Action>
  ): Promise<FunctionReturnType<Action>>;
}
