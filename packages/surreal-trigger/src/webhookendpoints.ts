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
    event: string,
  ) {
    return this.runTask(key, async (client, task, io) => {
      const eventName = `${table.toLowerCase()}_${event.toLowerCase()}`;

      const response = await client.query(
        `DEFINE EVENT ${eventName} ON TABLE ${table} WHEN $event = "${event}" THEN {
					RETURN http::post("${url}", {
						name: string::concat("record", ".", string::lowercase($event), "d"),
						before: $before,
						after: $after,
					});
				};`,
      );

      await io.logger.info("define surreal event: ", response);

      return response;
    });
  }
}
