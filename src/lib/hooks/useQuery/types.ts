import { FunctionReference, FunctionReturnType } from "convex/server";

type SuccesStatus<Query extends FunctionReference<"query">> = {
  status: "success";
  data: FunctionReturnType<Query>;
  error: undefined;
  isSuccess: true;
  isPending: false;
  isError: false;
};

type PendingStatus = {
  status: "pending";
  data: undefined;
  error: undefined;
  isSuccess: false;
  isPending: true;
  isError: false;
};

type ErrorStatus = {
  status: "error";
  data: undefined;
  error: Error;
  isSuccess: false;
  isPending: false;
  isError: true;
};

export type ReturnType<Query extends FunctionReference<"query">> =
  | SuccesStatus<Query>
  | PendingStatus
  | ErrorStatus;
