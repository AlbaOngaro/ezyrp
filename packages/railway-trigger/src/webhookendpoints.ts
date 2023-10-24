import { IntegrationTaskKey, retry } from "@trigger.dev/sdk";

import { RailwayRunTask, TriggerParams } from "./index";
import { gql } from "@apollo/client";

type CreateWebhookParams = TriggerParams & {
  url: string;
};

type ProjectWebhook = {
  id: string;
  url: string;
};

export class WebhookEndpoints {
  runTask: RailwayRunTask;

  constructor(runTask: RailwayRunTask) {
    this.runTask = runTask;
  }

  create(key: IntegrationTaskKey, { projectId, url }: CreateWebhookParams) {
    return this.runTask(key, async (client, task, io) => {
      const { data } = await client.query<{
        webhooks: { edges: { cursor: string; node: ProjectWebhook }[] };
      }>({
        query: gql`
          query webhooks($projectId: String!) {
            webhooks(projectId: $projectId) {
              edges {
                node {
                  id
                  url
                }
              }
            }
          }
        `,
        variables: {
          projectId,
        },
      });

      if (data.webhooks.edges.some((edge) => edge.node.url === url)) {
        return;
      }

      await client.mutate({
        mutation: gql`
          mutation webhookCreate($input: WebhookCreateInput!) {
            webhookCreate(input: $input) {
              id
              url
            }
          }
        `,
        variables: {
          input: {
            projectId,
            url,
          },
        },
      });
    });
  }
}
