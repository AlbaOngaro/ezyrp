const fs = require("fs");
const toml = require("toml");

const nixpacks = fs.readFileSync("nixpacks.toml", "utf8");

console.log(toml.parse(nixpacks));
