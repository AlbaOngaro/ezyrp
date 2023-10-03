import process from "process";
import path from "path";

import Bree from "bree";

import { Job } from "./types";
import { getSurreal } from "./surreal";

const bree = new Bree({
  root: path.join(__dirname, "jobs"),
  defaultExtension: process.env.TS_NODE ? "ts" : "js",
  jobs: [],
});

(async () => {
  const surreal = await getSurreal();

  const [{ result: jobs }] = await surreal.query<[Job[]]>(
    `SELECT * FROM job WHERE status != "completed"`,
  );

  await bree.add(
    jobs.map((job) => ({
      name: job.id,
      path: path.join(
        __dirname,
        `jobs/${job.type}.${process.env.TS_NODE ? "ts" : "js"}`,
      ),
    })),
  );

  if (bree.config.jobs.length > 0) {
    await bree.start();
  }

  await surreal.live<Job>("job", async ({ action, result }) => {
    switch (action) {
      case "CLOSE": {
        break;
      }
      case "DELETE": {
        await bree.remove(result.id);
        break;
      }
      case "CREATE": {
        await bree.add({
          name: result.id,
          cron: result.cron,
          path: path.join(
            __dirname,
            `jobs/${result.type}.${process.env.TS_NODE ? "ts" : "js"}`,
          ),
        });
        await bree.start();
        break;
      }
      case "UPDATE": {
        if (result.status !== "completed") {
          await bree.remove(result.id);
          await bree.add({
            name: result.id,
            path: path.join(
              __dirname,
              `jobs/${result.type}.${process.env.TS_NODE ? "ts" : "js"}`,
            ),
          });
          await bree.start();
        }
        break;
      }
    }
  });
})();
