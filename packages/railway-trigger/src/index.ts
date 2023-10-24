import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import {
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
import { z } from "zod";

import { WebhookEndpoints } from "./webhookendpoints";
import * as events from "./events";

type RailwayEvents = (typeof events)[keyof typeof events];

type CreateTriggersResult<TEventSpecification extends RailwayEvents> =
  ExternalSourceTrigger<
    TEventSpecification,
    ReturnType<typeof createWebhookEventSource>
  >;

export type TriggerParams = { projectId: string };

function createTrigger<TEventSpecification extends RailwayEvents>(
  source: ReturnType<typeof createWebhookEventSource>,
  event: TEventSpecification,
  params: TriggerParams,
): CreateTriggersResult<TEventSpecification> {
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
        source: "Railway.app",
        icon: "Railway",
        payload,
        name,
      },
    ],
  };
}

function createWebhookEventSource(
  integration: RailwayTrigger,
): ExternalSource<RailwayTrigger, TriggerParams, "HTTP", {}> {
  return new ExternalSource("HTTP", {
    id: "railway.webhook",
    schema: z.object({
      projectId: z.string(),
    }),
    version: "0.1.0",
    integration,
    key: ({ projectId }) => `railway.webhook.${projectId}`,
    handler: webhookHandler,
    register: async (event, io, ctx) => {
      const { params, options, source: httpSource } = event;

      try {
        const allEvents = Array.from(
          new Set([...options.event.desired, ...options.event.missing]),
        );

        await io.integration.webhookEndpoints.create("railway.webhook", {
          ...params,
          url: httpSource.url,
        });

        return {
          options: {
            event: allEvents,
          },
        };
      } catch (error: unknown) {
        console.error(error);
        return undefined;
      }
    },
  });
}

type RailwayIntegrationOptions = {
  id: string;
  projectId: string;
  accessToken: string;
};

export class RailwayTrigger implements TriggerIntegration {
  private _options: RailwayIntegrationOptions;
  private _client?: ApolloClient<NormalizedCacheObject>;
  private _io?: IO;
  private _connectionKey?: string;

  constructor(private options: RailwayIntegrationOptions) {
    this._options = options;
  }

  get id() {
    return this._options.id;
  }

  get metadata() {
    return { name: "Railway.app", id: "railway" };
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
    callback: (
      client: ApolloClient<NormalizedCacheObject>,
      task: IOTask,
      io: IO,
    ) => Promise<TResult>,
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
        icon: "railway",
        retry: retry.standardBackoff,
        ...(options ?? {}),
        connectionKey: this._connectionKey,
      },
      errorCallback,
    );
  }

  cloneForRun(io: IO, connectionKey: string) {
    const railway = new RailwayTrigger(this._options);

    railway._io = io;
    railway._connectionKey = connectionKey;

    const client = new ApolloClient({
      uri: "https://backboard.railway.app/graphql/v2",
      headers: {
        Authorization: `Bearer ${this.options.accessToken}`,
      },
      cache: new InMemoryCache(),
    });

    railway._client = client;

    return railway;
  }

  onDeploy() {
    return createTrigger(this.source, events.onDeploy, {
      projectId: this.options.projectId,
    });
  }
}

export type RailwayRunTask = InstanceType<typeof RailwayTrigger>["runTask"];
