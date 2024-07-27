import { convexTest } from "convex-test";
import schema from "convex/schema";

const modules = import.meta.glob("../../../convex/**/!(*.*.*)*.*s");

const t = convexTest(schema, modules);
export const convexMockServer = t.withIdentity({
  tokenIdentifier: "https://testingasdf|userid1",
  // @ts-ignore
  websiteUrl: "test",
  gender: "org:admin",
});
