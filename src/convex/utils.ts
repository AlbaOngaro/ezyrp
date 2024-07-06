import {
  GenericMutationCtx,
  GenericQueryCtx,
  TableNamesInDataModel,
  UserIdentity,
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

/**
 * Extracts the user_id and workspace from the auth object. Throws an error if the user is not authenticated or if the workspace is not found.
 **/
export async function getAuthData(ctx: Ctx) {
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

  return {
    user_id: identity.tokenIdentifier,
    workspace: identity.websiteUrl,
  };
}

type GetEntityByIdInWorkspaceArgs<
  I extends TableNames,
  N extends TableNamesInDataModel<DataModel>,
> = {
  id: Id<I>;
  table: N;
};

/**
 * Tries to get an entity by its id in the current auth workspace. Throws an error if not found.
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
>(ctx: Ctx, table: N): Promise<Doc<N>[]> {
  const { workspace } = await getAuthData(ctx);

  return await ctx.db
    .query(table)
    .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
    .collect();
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
