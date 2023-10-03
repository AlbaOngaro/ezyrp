import { workerData, parentPort } from "worker_threads";
import process from "process";

import { getSurreal } from "../surreal";

(async () => {
  console.log("Starting email job!");

  const surreal = await getSurreal();
  const id = workerData.job.name;

  try {
    await surreal.merge(id, {
      status: "completed",
    });

    // signal to parent that the job is done
    if (parentPort) parentPort.postMessage("done");
    else process.exit(0);
  } catch (error: unknown) {
    await surreal.merge(id, {
      status: "error",
    });

    process.exit(1);
  }
})();
