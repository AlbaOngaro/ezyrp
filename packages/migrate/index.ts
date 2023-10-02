#!/usr/bin/env node

import { Command } from "commander";

import { deploy } from "./commands/deploy";
import { create } from "./commands/create";
import { setup } from "./commands/setup";
import { isSetup } from "./utils/isSetup";

const program = new Command();

program
  .version("0.1.0")
  .name("migrate")
  .description("Surrealdb migration manager");

program.command("setup").description("Setup migration helper").action(setup);

program
  .command("deploy")
  .description("Apply migrations to surrealdb instance")
  .option("-p, --profile <profile>", "Which profile you want to use", "default")
  .action(deploy);

program
  .command("create")
  .description("Create new migration file.")
  .option("-p, --profile <profile>", "Which profile you want to use", "default")
  .action(create);

if (!isSetup()) {
  setup();
} else {
  program.parse(process.argv);
}
