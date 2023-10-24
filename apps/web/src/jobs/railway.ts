import { RailwayTrigger } from "@nimblerp/railway-trigger"

import { client } from "lib/trigger";

const railway = new RailwayTrigger({
  id: "railway-0.0.3",
  accessToken: process.env.RAILWAY_TOKEN as string,
  projectId: "ad2b770f-13b8-4108-9804-b4f1f086f0f9"
});

client.defineJob({
  id: "deployment",
  name: "Railway Deployment",
  version: "0.0.3",
  integrations: {
    railway,
  },
  enabled: true,
  trigger: railway.onDeploy(),
  run: async (_payload, io, _ctx) => {
    await io.logger.debug("Railway Deployment!")
  },
});
