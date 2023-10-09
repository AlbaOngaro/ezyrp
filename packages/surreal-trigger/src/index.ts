import {
  EventSpecification,
  ExternalSource,
  ExternalSourceTrigger,
  HandlerEvent,
  IO,
  IOTask,
  IntegrationTaskKey,
  Json,
  Logger,
  RunTaskErrorCallback,
  RunTaskOptions,
  TriggerIntegration,
  retry,
} from "@trigger.dev/sdk";
import { Surreal } from "surrealdb.js";
import { z } from "zod";

import * as events from "./events";
import { WebhookEndpoints } from "./webhookendpoints";

type SurrealEvents<
  T extends Record<string, unknown> = Record<string, unknown>,
> =
  | EventSpecification<events.OnRecordCreatedEvent<T>>
  | EventSpecification<events.OnRecordUpdatedEvent<T>>
  | EventSpecification<events.OnRecordDeletedEvent<T>>;

type CreateTriggersResult<
  TEventSpecification extends SurrealEvents<T>,
  T extends Record<string, unknown> = Record<string, unknown>,
> = ExternalSourceTrigger<
  TEventSpecification,
  ReturnType<typeof createWebhookEventSource>
>;

export type TriggerParams = {
  table: string;
};

function createTrigger<
  TEventSpecification extends SurrealEvents<T>,
  T extends Record<string, unknown> = Record<string, unknown>,
>(
  source: ReturnType<typeof createWebhookEventSource>,
  event: TEventSpecification,
  params: TriggerParams,
): CreateTriggersResult<TEventSpecification, T> {
  return new ExternalSourceTrigger({
    event,
    params,
    source,
    options: {},
  });
}

async function webhookHandler(event: HandlerEvent<"HTTP">, logger: Logger) {
  console.debug("[@nimblerp/surreal] Handling webhook payload");

  const { rawEvent: request } = event;

  if (!request.body) {
    console.debug("[@nimblerp/surreal] No body found");
    return { events: [] };
  }

  const { name, ...payload } = await request.json();

  return {
    events: [
      {
        title: "Record created",
        source: "SurrealDb",
        icon: "Surrealdb",
        payload,
        name,
      },
    ],
  };
}

const ALLOWED_EVENTS = ["CREATE", "UPDATE", "DELETE"];

function createWebhookEventSource(
  integration: SurrealTrigger,
): ExternalSource<SurrealTrigger, TriggerParams, "HTTP", {}> {
  return new ExternalSource("HTTP", {
    id: "surreal.webhook",
    schema: z.object({
      table: z.string(),
      name: z.string().optional(),
    }),
    version: "0.1.0",
    integration,
    key: ({ table }) => `surreal.webhook.${table}`,
    handler: webhookHandler,
    register: async (event, io, ctx) => {
      const { params, source: httpSource, options } = event;

      const allEvents = Array.from(
        new Set([...options.event.desired, ...options.event.missing]),
      ).filter((e) => ALLOWED_EVENTS.includes(e));

      await io.integration.webhookEndpoints.create(
        "create-webhook",
        {
          ...params,
          url: httpSource.url,
        },
        allEvents,
      );

      return {
        options: {
          event: allEvents,
        },
      };
    },
  });
}

type SurrealIntegrationOptions = {
  id: string;
  host: string;
  user: string;
  pass: string;
};

export class SurrealTrigger implements TriggerIntegration {
  private _options: SurrealIntegrationOptions;
  private _client?: Surreal;
  private _io?: IO;
  private _connectionKey?: string;

  constructor(private options: SurrealIntegrationOptions) {
    this._options = options;
  }

  get id() {
    return this._options.id;
  }

  get metadata() {
    return { name: "Surrealdb", id: "surrealdb" };
  }

  get authSource() {
    return "LOCAL" as const;
  }

  get source() {
    return createWebhookEventSource(this);
  }

  get webhookEndpoints() {
    return new WebhookEndpoints(this.runTask.bind(this));
  }

  runTask<T, TResult extends Json<T> | void>(
    key: IntegrationTaskKey,
    callback: (client: Surreal, task: IOTask, io: IO) => Promise<TResult>,
    options?: RunTaskOptions,
    errorCallback?: RunTaskErrorCallback,
  ): Promise<TResult> {
    if (!this._io) throw new Error("No IO");
    if (!this._connectionKey) throw new Error("No connection key");

    return this._io.runTask(
      key,
      (task, io) => {
        if (!this._client) throw new Error("No client");
        return callback(this._client, task, io);
      },
      {
        icon: "surrealdb",
        retry: retry.standardBackoff,
        ...(options ?? {}),
        connectionKey: this._connectionKey,
      },
      errorCallback,
    );
  }

  cloneForRun(io: IO, connectionKey: string) {
    const surreal = new SurrealTrigger(this._options);

    surreal._io = io;
    surreal._connectionKey = connectionKey;

    const client = new Surreal();
    client.connect(this._options.host);
    client.signin({
      DB: "crm",
      NS: "crm",
      user: this._options.user,
      pass: this._options.pass,
    });

    surreal._client = client;

    return surreal;
  }

  onRecordCreated<T extends Record<string, unknown>>(params: TriggerParams) {
    return createTrigger<EventSpecification<events.OnRecordCreatedEvent<T>>, T>(
      this.source,
      events.onCreate<T>(),
      params,
    );
  }

  onRecordUpdated<T extends Record<string, unknown>>(params: TriggerParams) {
    return createTrigger<EventSpecification<events.OnRecordUpdatedEvent<T>>, T>(
      this.source,
      events.onUpdate<T>(),
      params,
    );
  }

  onRecordDeleted<T extends Record<string, unknown>>(params: TriggerParams) {
    return createTrigger<EventSpecification<events.OnRecordDeletedEvent<T>>, T>(
      this.source,
      events.onDelete<T>(),
      params,
    );
  }
}

export type SurrealRunTask = InstanceType<typeof SurrealTrigger>["runTask"];
