import { convexTest } from "convex-test";
import schema from "../../schema";

const modules = import.meta.glob("../../**/!(*.*.*)*.*s");
export const t = convexTest(schema, modules);
