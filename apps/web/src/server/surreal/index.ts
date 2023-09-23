import { Surreal, ExperimentalSurrealHTTP } from "surrealdb.js";

const surreal =
  process.env.NEXT_RUNTIME === "edge"
    ? new ExperimentalSurrealHTTP(process.env.SURREAL_HOST)
    : new Surreal();

surreal.connect(process.env.SURREAL_HOST as string);

export { surreal };
