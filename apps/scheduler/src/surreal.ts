import { Surreal } from "surrealdb.js";

export async function getSurreal() {
  const surreal = new Surreal();
  await surreal.connect(process.env.SURREAL_HOST as string);

  await surreal.signin({
    user: process.env.SURREAL_USER,
    pass: process.env.SURREAL_PASS,
  });

  await surreal.use({ ns: "crm", db: "crm" });

  return surreal;
}
