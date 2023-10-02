import fs from "fs";
import path from "path";

import { clean } from "../utils/clean";
import { getConfig } from "../utils/getConfig";

export async function deploy({ profile }) {
  const config = (await getConfig())[profile];

  const files = await new Promise<string[]>((resolve, reject) =>
    fs.readdir(config.migrations, (err, paths) => {
      if (err) {
        return reject(err);
      }

      resolve(paths.map((p) => path.join(config.migrations, p)));
    }),
  );

  const [theirs, ...merged] = await Promise.all([
    fetch(config.surreal_host.replace("/rpc", "/export") as string, {
      headers: {
        Accept: "application/json",
        NS: "crm",
        DB: "crm",
        Authorization: `Basic ${Buffer.from(
          `${config.surreal_user}:${config.surreal_password}`,
        ).toString("base64")}`,
      },
    })
      .then((res) => res.text())
      .then((text) => clean(text)),
    ...files.sort().map(
      (file) =>
        new Promise((resolve, reject) =>
          fs.readFile(file, (err, data) => {
            if (err) {
              return reject(err);
            }

            return resolve(data.toString());
          }),
        ),
    ),
  ]);

  const ours = clean(merged.join("\n"));

  const migrations = ours.filter((line) => {
    const tokens = line.split(/\s/);
    return !theirs?.some((l) => tokens.every((t) => l.includes(t)));
  });

  migrations.unshift("OPTION IMPORT;");

  const res = await fetch(
    config.surreal_host.replace("/rpc", "/import") as string,
    {
      method: "POST",
      body: migrations.join("\n"),
      headers: {
        Accept: "application/json",
        NS: "crm",
        DB: "crm",
        Authorization: `Basic ${Buffer.from(
          `${config.surreal_user}:${config.surreal_password}`,
        ).toString("base64")}`,
      },
    },
  ).then((res) => res.json());

  console.debug(res);
}
