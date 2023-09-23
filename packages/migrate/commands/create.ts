import fs from "fs";
import path from "path";

import { format } from "date-fns";

export function create() {
  console.debug("create");

  const filename = `${format(new Date(), "yyyy_MM_dd_HH:mm")}.surql`;

  fs.writeFileSync(
    path.join(path.resolve("services/surreal/migrations"), filename),
    "",
  );
}
