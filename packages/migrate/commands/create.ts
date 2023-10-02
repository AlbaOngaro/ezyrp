import fs from "fs";
import path from "path";

import { format } from "date-fns";

import { getConfig } from "../utils/getConfig";

export async function create({ profile }) {
  const config = (await getConfig())[profile];
  const filename = `${format(new Date(), "yyyy_MM_dd_HH:mm")}.surql`;
  fs.writeFileSync(path.join(config.migrations, filename), "");
}
