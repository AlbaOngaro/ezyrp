import { checkBrackets } from "./checkBrackets";

export function clean(schema: string): string[] {
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
