import { Command } from "commander";

import { deploy } from "./commands/deploy";
import { create } from "./commands/create";

const program = new Command();

program
  .version("0.1.0")
  .name("migrate")
  .description("Surrealdb migration manager");

program
  .command("deploy")
  .description("Apply migrations to surrealdb instance")
  .action(deploy);

program
  .command("create")
  .description("Create new migration file.")
  .action(create);

program.parse();
