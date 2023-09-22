import { Surreal, ExperimentalSurrealHTTP } from "surrealdb.js";

export const surreal =
  process.env.NEXT_RUNTIME === "edge"
    ? new ExperimentalSurrealHTTP(process.env.SURREAL_HOST)
    : new Surreal(process.env.SURREAL_HOST);
