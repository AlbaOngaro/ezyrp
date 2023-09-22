import fs from "fs";
import path from "path";
import { exec } from "child_process";

import { format } from "date-fns";

function checkBrackets(expression: string) {
  const stack: string[] = [];
  const bracketLookup: Record<string, string> = {
    "{": "}",
    "(": ")",
    "[": "]",
  };

  for (const key of expression) {
    if (Object.keys(bracketLookup).includes(key)) {
      stack.push(key);
    } else if (Object.values(bracketLookup).includes(key)) {
      const lastBracket = stack.pop();
      if (lastBracket && bracketLookup[lastBracket] !== key) {
        return false;
      }
    }
  }

  return stack.length === 0;
}

function clean(schema: string): string[] {
  return schema
    .split("\n")
    .filter((line) => !line.startsWith("-"))
    .reduce<string[]>((acc, line) => {
      const current = line.trim();
      if (!current) {
        return acc;
      }

      const isSelfClosingCommand = /^DEFINE (.*);$/g;
      if (isSelfClosingCommand.test(current)) {
        return [...acc, current];
      }

      const previous = acc.at(-1);
      if (!previous) {
        return acc;
      }

      if (checkBrackets(previous) && isSelfClosingCommand.test(previous)) {
        return [...acc, current];
      }

      acc.splice(-1, 1, previous + " " + current);

      return acc;
    }, []);
}

(async () => {
  const [ours, theirs] = await Promise.all([
    new Promise<string[]>((resolve, reject) =>
      fs.readFile(
        path.resolve("services/surreal/schema.surql"),
        (error, data) => {
          if (error) {
            return reject(error);
          }
          return resolve(clean(data.toString()));
        },
      ),
    ),

    fetch("http://localhost:8080/export", {
      headers: {
        Accept: "application/json",
        NS: "crm",
        DB: "crm",
        Authorization: "Basic cm9vdDpyb290",
      },
    })
      .then((res) => res.text())
      .then((text) => clean(text)),
  ]);

  const migrations = ours.filter((line) => {
    const tokens = line.split(/\s/);
    return !theirs?.some((l) => tokens.every((t) => l.includes(t)));
  });

  migrations.unshift("OPTION IMPORT;");

  const filename = `${format(new Date(), "yyyy_MM_dd_HH:mm")}.surql`;

  await new Promise<void>((resolve, reject) =>
    fs.writeFile(filename, migrations.join("\n"), (error) => {
      if (error) {
        return reject(error);
      }

      resolve();
    }),
  );

  await new Promise((resolve, reject) =>
    exec(
      `surreal import --conn ${process.env.SURREAL_HOST?.replace(
        "/rpc",
        "",
      )} --user ${process.env.SURREAL_USER} --pass ${
        process.env.SURREAL_PASS
      } --ns crm --db crm ${filename}`,
      (error, stdout, stderr) => {
        if (error) {
          return reject(error);
        }

        return resolve(stdout || stderr);
      },
    ),
  );

  fs.unlinkSync(filename);
})();
