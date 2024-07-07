import { convexTest } from "convex-test";
import schema from "convex/schema";

const modules = import.meta.glob("../../../convex/**/!(*.*.*)*.*s");

const t = convexTest(schema, modules);
// @ts-ignore
export const convexMockServer = t.withIdentity({ websiteUrl: "test" });
