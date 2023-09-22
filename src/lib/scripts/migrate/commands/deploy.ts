import fs from "fs";
import path from "path";

import { clean } from "../utils/clean";

export async function deploy() {
  const files = await new Promise<string[]>((resolve, reject) =>
    fs.readdir(path.resolve("services/surreal/migrations"), (err, paths) => {
      if (err) {
        return reject(err);
      }

      resolve(
        paths.map((p) =>
          path.resolve(path.join("services/surreal/migrations", p)),
        ),
      );
    }),
  );

  const [theirs, ...merged] = await Promise.all([
    fetch(process.env.SURREAL_HOST?.replace("/rpc", "") as string, {
      headers: {
        Accept: "application/json",
        NS: "crm",
        DB: "crm",
        Authorization: "Basic cm9vdDpyb290",
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

  fetch(process.env.SURREAL_HOST?.replace("/rpc", "/import") as string, {
    method: "POST",
    body: migrations.join("\n"),
    headers: {
      Accept: "application/json",
      NS: "crm",
      DB: "crm",
      Authorization: "Basic cm9vdDpyb290",
    },
  })
    .then((res) => res.text())
    .then((text) => clean(text));
}
