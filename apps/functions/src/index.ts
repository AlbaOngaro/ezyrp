import Fastify from "fastify";

import { deployment } from "./handlers/deployment";

const fastify = Fastify({
  logger: true,
});

fastify.get("/health", (_, res) => res.status(200).send());
fastify.post("/deployment", deployment);

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
