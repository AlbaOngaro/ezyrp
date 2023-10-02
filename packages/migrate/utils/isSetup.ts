import fs from "fs";
import path from "path";

export function isSetup() {
  const isAlreadySetup = fs.existsSync(path.resolve(".migrate"));

  if (!isAlreadySetup) {
    fs.mkdirSync(path.resolve(".migrate"));
  }

  return isAlreadySetup;
}
