import {
  GenericMutationCtx,
  GenericQueryCtx,
  TableNamesInDataModel,
  UserIdentity,
  PaginationOptions,
  PaginationResult,
  GenericActionCtx,
} from "convex/server";
import { ConvexError } from "convex/values";
import { v4 as uuid, validate } from "uuid";
import { capitalize } from "lodash";

import { DataModel, Doc, Id, TableNames } from "./_generated/dataModel";
import {
  AnyEvent,
  CustomerEvents,
  EventEvents,
  InvoiceEvents,
  isCustomerEvent,
  isEventEvent,
  isInvoiceEvent,
  Settings,
} from "./workflows";

type Ctx = GenericQueryCtx<any> | GenericMutationCtx<any>;

const regex = /https:\/\/.*\|(.*)$/;

/**
 * Extracts the user_id and workspace from the auth object.
 * Throws an error if the user is not authenticated or if the workspace is not found.
 **/
export async function getAuthData(ctx: Ctx | GenericActionCtx<any>): Promise<
  UserIdentity & {
    role: "org:admin" | "org:member";
    user_id: string;
    workspace: string;
    clerk_id: string;
  }
> {
  const identity = (await ctx.auth.getUserIdentity()) as UserIdentity & {
    websiteUrl?: string;
  };
  if (!identity) {
    throw new ConvexError(
      "Unautneticated, please login to access this resource",
    );
  }

  if (!identity.websiteUrl) {
    throw new ConvexError("Cannot get workspace from user identity; Aborting.");
  }

  if (identity.gender !== "org:admin" && identity.gender !== "org:member") {
    throw new ConvexError("Invalid role; Aborting.");
  }

  const match = regex.exec(identity.tokenIdentifier);
  if (!match || !match[1]) {
    throw new ConvexError("Cannot get clerk_id from user identity; Aborting.");
  }

  const clerk_id = match[1];

  return {
    ...identity,
    role: identity.gender,
    clerk_id,
    user_id: identity.tokenIdentifier,
    workspace: identity.websiteUrl,
  };
}

/**
 * Gets the user by their clerk_id. Throws an error if not found.
 */
export async function getUserByClerkId(
  ctx: Ctx,
  {
    clerk_id,
  }: {
    clerk_id: string;
  },
): Promise<Doc<"users">> {
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerk_id", clerk_id))
    .unique();

  if (!user) {
    throw new ConvexError("User not found");
  }

  return user;
}

/**
 * Checks if the user is a pro user. Throws an error if not.
 */
export async function isProUserGuard(ctx: Ctx) {
  const { clerk_id } = await getAuthData(ctx);
  const user = await getUserByClerkId(ctx, { clerk_id });
  if (user.plan !== "pro") {
    throw new ConvexError("User is not a pro user");
  }
}

type GetEntityByIdInWorkspaceArgs<
  I extends TableNames,
  N extends TableNamesInDataModel<DataModel>,
> = {
  id: Id<I>;
  table: N;
};

/**
 * Tries to get an entity by its id in the current auth workspace.
 * Throws an error if not found.
 */
export async function getEntityByIdInWorkspace<
  I extends TableNames,
  N extends TableNamesInDataModel<DataModel>,
>(
  ctx: Ctx,
  { id, table }: GetEntityByIdInWorkspaceArgs<I, N>,
): Promise<Doc<N>> {
  const { workspace } = await getAuthData(ctx);

  const entity = await ctx.db
    .query(table)
    .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
    .filter((q) => q.eq(q.field("_id"), id))
    .unique();

  if (!entity) {
    throw new ConvexError(`${capitalize(table)} not found in workspace`);
  }

  return entity;
}

/**
 * Gets all entities of the required type in the current auth workspace.
 */
export async function getEntitiesInWorkspace<
  N extends TableNamesInDataModel<DataModel>,
>(ctx: Ctx, table: N, order: "asc" | "desc" = "asc"): Promise<Doc<N>[]> {
  const { workspace } = await getAuthData(ctx);

  return await ctx.db
    .query(table)
    .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
    .order(order)
    .collect();
}

/**
 * Gets all entities of the required type in the current auth workspace paginated.
 */
export async function getPaginatedEntitiesInWorkspace<
  N extends TableNamesInDataModel<DataModel>,
>(
  ctx: Ctx,
  table: N,
  paginationOpts: PaginationOptions,
): Promise<PaginationResult<Doc<N>>> {
  const { workspace } = await getAuthData(ctx);

  return await ctx.db
    .query(table)
    .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
    .paginate(paginationOpts);
}

export function getValidUuid(): string {
  const id = uuid();

  if (validate(id)) {
    return id;
  }

  return getValidUuid();
}

type BaseWorkflow = Omit<Doc<"workflows">, "settings">;

type CustomerSettings = Extract<Settings, { event: CustomerEvents }>;
type CustomerWorkflow = BaseWorkflow & {
  settings: CustomerSettings;
};

type InvoiceSettings = Extract<Settings, { event: InvoiceEvents }>;
type InvoiceWorkflow = BaseWorkflow & {
  settings: InvoiceSettings;
};

type EventSettings = Extract<Settings, { event: EventEvents }>;
type EventWorkflow = BaseWorkflow & {
  settings: EventSettings;
};

type AnyWorkflow = CustomerWorkflow | InvoiceWorkflow | EventWorkflow;

export function isCustomerWorkflow(
  workflow: AnyWorkflow,
): workflow is CustomerWorkflow {
  return isCustomerEvent(workflow.settings.event);
}

export function isInvoiceWorkflow(
  workflow: AnyWorkflow,
): workflow is InvoiceWorkflow {
  return isInvoiceEvent(workflow.settings.event);
}

export function isEventWorkflow(
  workflow: AnyWorkflow,
): workflow is EventWorkflow {
  return isEventEvent(workflow.settings.event);
}

export async function getWorkflowForEvent<E extends AnyEvent>(
  ctx: Ctx,
  event: E,
  workspace: string,
): Promise<AnyWorkflow | null> {
  const workflows = await ctx.db
    .query("workflows")
    .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
    .filter((q) => q.eq(q.field("settings.event"), event))
    .collect();

  const workflow = workflows.find(
    (workflow) => workflow?.settings?.event === event,
  );

  if (!workflow) {
    return null;
  }

  return workflow;
}
