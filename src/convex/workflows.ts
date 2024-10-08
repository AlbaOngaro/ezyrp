import { v } from "convex/values";
import { getYear, isSameDay, parseISO, setYear } from "date-fns";
import { paginationOptsValidator } from "convex/server";
import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import {
  getAuthData,
  getEntitiesInWorkspace,
  getEntityByIdInWorkspace,
  getWorkflowForEvent,
  isCustomerWorkflow,
  isEventWorkflow,
  isInvoiceWorkflow,
} from "./utils";

import {
  invoiceEvents,
  customerEvents,
  eventEvents,
  action,
  settings,
  recurringCustomerEvents,
} from "./schema";
import { Id } from "./_generated/dataModel";
import { api, internal } from "./_generated/api";

export const get = query({
  args: {
    id: v.id("workflows"),
  },
  handler: async (ctx, { id }) => {
    return await getEntityByIdInWorkspace(ctx, {
      id,
      table: "workflows",
    });
  },
});

export const search = query({
  args: {
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { status, paginationOpts }) => {
    const { workspace } = await getAuthData(ctx);

    return await ctx.db
      .query("workflows")
      .withIndex("by_workspace", (q) => q.eq("workspace", workspace))
      .filter((q) => (status ? q.eq(q.field("status"), status) : true))
      .paginate(paginationOpts);
  },
});

export const list = query({
  handler: async (ctx) => {
    return await getEntitiesInWorkspace(ctx, "workflows");
  },
});

export const create = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, { title }) => {
    const { workspace } = await getAuthData(ctx);

    const id = await ctx.db.insert("workflows", {
      title,
      workspace,
      status: "inactive",
      nodes: [],
      edges: [],
    });

    return id;
  },
});

export const update = mutation({
  args: {
    id: v.id("workflows"),
    status: v.optional(v.union(v.literal("active"), v.literal("inactive"))),
    title: v.optional(v.string()),
    nodes: v.optional(v.array(v.any())),
    edges: v.optional(v.array(v.any())),
    settings: v.optional(settings),
  },
  handler: async (ctx, { id, status, title, nodes, edges, settings }) => {
    console.log(settings);

    const workflow = await getEntityByIdInWorkspace(ctx, {
      id,
      table: "workflows",
    });

    await ctx.db.patch(workflow._id, {
      title: title || workflow.title,
      nodes: nodes || workflow.nodes,
      edges: edges || workflow.edges,
      status: status || workflow.status,
      settings: settings || workflow.settings,
    });
  },
});

export const remove = mutation({
  args: {
    id: v.id("workflows"),
  },
  handler: async (ctx, { id }) => {
    await getEntityByIdInWorkspace(ctx, {
      id,
      table: "workflows",
    });

    await ctx.db.delete(id);
  },
});

const event = v.union(
  invoiceEvents,
  customerEvents,
  eventEvents,
  recurringCustomerEvents,
);

export type InvoiceEvents = typeof invoiceEvents.type;
export type EventEvents = typeof eventEvents.type;
export type CustomerEvents = typeof customerEvents.type;
export type RecurringEvents = typeof recurringCustomerEvents.type;
export type AnyEvent = typeof event.type;
export type Action = typeof action.type;
export type Settings = typeof settings.type;

type EventArgs = {
  event: EventEvents;
  entityId: Id<"events">;
};

type CustomerArgs = {
  event: CustomerEvents;
  entityId: Id<"customers">;
};

type InvoiceArgs = {
  event: InvoiceEvents;
  entityId: Id<"invoices">;
};

type TriggerArgs = EventArgs | CustomerArgs | InvoiceArgs;

export function isEventEvent(event: AnyEvent): event is EventEvents {
  return event.startsWith("event:");
}

function isEventArgs(args: TriggerArgs): args is EventArgs {
  return isEventEvent(args.event);
}

export function isCustomerEvent(event: AnyEvent): event is CustomerEvents {
  return event.startsWith("customer:");
}

function isCustomerArgs(args: TriggerArgs): args is CustomerArgs {
  return isCustomerEvent(args.event);
}

export function isInvoiceEvent(event: AnyEvent): event is InvoiceEvents {
  return event.startsWith("invoice:");
}

function isInvoiceArgs(args: TriggerArgs): args is InvoiceArgs {
  return isInvoiceEvent(args.event);
}

export const trigger = internalMutation({
  args: {
    args: v.union(
      v.object({
        event: eventEvents,
        workspace: v.string(),
        entityId: v.id("events"),
      }),
      v.object({
        event: customerEvents,
        workspace: v.string(),
        entityId: v.id("customers"),
      }),
      v.object({
        event: invoiceEvents,
        workspace: v.string(),
        entityId: v.id("invoices"),
      }),
    ),
  },
  handler: async (ctx, { args }) => {
    const workflow = await getWorkflowForEvent(ctx, args.event, args.workspace);
    if (!workflow || workflow.status !== "active" || !workflow.settings) {
      console.log("No active workflow found for event.");
      return;
    }

    if (isEventArgs(args) && isEventWorkflow(workflow)) {
      console.log("Running event event.");
      const event = await ctx.db.get(args.entityId);
      if (!event) {
        return;
      }

      const action = workflow.settings.action;
      switch (action) {
        case "email": {
          const { template, delay } = workflow.settings;
          const emails: string[] = [];

          // const emails = await Promise.all(
          //   event.guests.map((guest) =>
          //     getEntityByIdInWorkspace(ctx, {
          //       id: guest,
          //       table: "customers",
          //     }).then(({ email }) => email),
          //   ),
          // );
          if (template && emails) {
            await Promise.all(
              emails.map((email) =>
                ctx.scheduler.runAt(
                  new Date(event.start).getTime() + delay,
                  api.actions.email,
                  {
                    template,
                    to: email,
                  },
                ),
              ),
            );
          }
          return;
        }
        case "sms":
          console.log("SMS not implemented yet.");
          return;
      }
    }

    if (isCustomerArgs(args) && isCustomerWorkflow(workflow)) {
      console.log("Running customer event.");
      const customer = await ctx.db.get(args.entityId);
      if (!customer) {
        console.log("Customer not found.");
        return;
      }

      const action = workflow.settings.action;
      switch (action) {
        case "email": {
          const { template } = workflow.settings;
          console.log("Preparing to send email data", {
            template,
            to: customer.email,
          });

          if (template && customer.email) {
            await ctx.scheduler.runAfter(0, api.actions.email, {
              template,
              to: customer.email,
            });
          }
          return;
        }
        case "sms":
          console.log("SMS not implemented yet.");
          return;
      }
    }

    if (isInvoiceArgs(args) && isInvoiceWorkflow(workflow)) {
      console.log("Running invoice event.");
      const invoice = await ctx.db.get(args.entityId);
      if (!invoice) {
        console.log("Could not find invoice.");
        return;
      }

      const customer = await ctx.db.get(invoice.customer);
      if (!customer) {
        console.log("Could not find customer.");
        return;
      }

      const action = workflow.settings.action;
      switch (action) {
        case "email": {
          const { template } = workflow.settings;
          if (template && customer.email) {
            await ctx.scheduler.runAfter(0, api.actions.email, {
              template,
              to: customer.email,
            });
          }
          return;
        }
        case "sms":
          console.log("SMS not implemented yet.");
          return;
      }
    }

    console.log("Could not find a matching workflow.");
  },
});

export const getActiveWorkflowsByEvent = internalQuery({
  args: {
    event,
  },
  handler: async (ctx, { event }) => {
    return await ctx.db
      .query("workflows")
      .filter((q) =>
        q.and(
          q.eq(q.field("settings.event"), event),
          q.eq(q.field("status"), "active"),
        ),
      )
      .collect();
  },
});

export const recurringtrigger = internalAction({
  args: {
    event: recurringCustomerEvents,
  },
  handler: async (ctx, { event }) => {
    const workflows = await ctx.runQuery(
      internal.workflows.getActiveWorkflowsByEvent,
      {
        event,
      },
    );

    for (const workflow of workflows) {
      console.log("Running workflow", workflow._id);
      const customers = await ctx.runQuery(internal.customers.listInternal, {
        workspace: workflow.workspace,
      });

      console.log("Found customers", customers.length);

      for (const customer of customers) {
        if (!customer.birthday) {
          console.log("Customer does not have birthday, abort.", customer._id);
          continue;
        }

        const now = new Date().toISOString();
        let birthday = parseISO(customer.birthday);
        birthday = setYear(birthday, getYear(parseISO(now)));

        if (isSameDay(birthday, parseISO(now))) {
          console.log("Sending birthday email to", customer.email);

          await ctx.runMutation(internal.workflows.trigger, {
            args: {
              event: "customer:birthday",
              entityId: customer._id,
              workspace: workflow.workspace,
            },
          });
        }
      }
    }
  },
});
