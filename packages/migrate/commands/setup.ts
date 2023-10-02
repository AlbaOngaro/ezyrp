import path from "path";
import fs from "fs";

import { getConfig } from "../utils/getConfig";
import { isSetup } from "../utils/isSetup";

export async function setup() {
  const inquirer = await import("inquirer").then((mod) => mod.default);
  const chalk = await import("chalk").then((mod) => mod.default);

  isSetup();

  const config = await getConfig();

  const { migrations, profile, surreal_host, surreal_user, surreal_password } =
    await inquirer.prompt([
      {
        type: "input",
        name: "profile",
        message: "What name would youn like to give to this profile?",
        default: "default",
      },
      {
        type: "input",
        name: "migrations",
        message: "Where you like to put the generate migration files?",
      },
      {
        type: "input",
        name: "surreal_host",
        message: "Surreal host",
      },
      {
        type: "input",
        name: "surreal_user",
        message: "Surreal user",
      },
      {
        type: "input",
        name: "surreal_password",
        message: "Surreal password",
      },
    ]);

  if (profile in config) {
    const { confirm } = await inquirer.prompt({
      type: "confirm",
      name: "confirm",
      message: `Profile ${profile} already exists, do you want to override it?`,
    });

    if (!confirm) {
      process.exit(0);
    }
  }

  fs.writeFileSync(
    path.resolve(".migrate/config.json"),
    JSON.stringify({
      ...config,
      [profile]: {
        migrations: path.resolve(migrations),
        surreal_host,
        surreal_user,
        surreal_password,
      },
    }),
  );

  console.log(chalk.green(`Profile ${profile} saved succesfully!`));
}
