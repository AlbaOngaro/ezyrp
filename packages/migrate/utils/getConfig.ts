import fs from "fs";
import path from "path";

import { Config } from "../types";

export async function getConfig() {
  return new Promise<Config>((resolve) =>
    fs.readFile(path.resolve(".migrate/config.json"), (err, data) => {
      if (err) {
        return resolve({});
      }

      return resolve(JSON.parse(data.toString()));
    }),
  );
}
