import { IntegrationTaskKey, retry } from "@trigger.dev/sdk";

import { SurrealRunTask, TriggerParams } from "./index";

type CreateWebhookParams = TriggerParams & {
  url: string;
};

export class WebhookEndpoints {
  runTask: SurrealRunTask;

  constructor(runTask: SurrealRunTask) {
    this.runTask = runTask;
  }

  create(
    key: IntegrationTaskKey,
    { table, url }: CreateWebhookParams,
    events: string[],
  ) {
    return this.runTask(key, async (client, task, io) => {
      const response = await client.query(
        `BEGIN TRANSACTION;
        
        ${events
          .map((event) => {
            return `
            DEFINE EVENT ${table}_${event.toLowerCase()}d ON TABLE ${table} WHEN $event = "${event}" THEN {
              RETURN http::post("${url}", {
                name: $event,
                before: $before,
                after: $after,
              });
            };
          `;
          })
          .join("\n")}

        COMMIT TRANSACTION;`,
      );

      await io.logger.info("Defined surreal event: ", response);
      console.info("Defined surreal events: ", response);

      return response;
    });
  }
}
