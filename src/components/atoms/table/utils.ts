import { Row, TableContextMenuItem } from "./types";
import { ContextMenuItem } from "components/organisms/context-menu/types";

export function wrapWithRow<R extends Row = Row>(
  item: TableContextMenuItem<R>,
  row: R,
): ContextMenuItem {
  return Object.entries(item).reduce<ContextMenuItem>((acc, [key, value]) => {
    if (typeof value === "function") {
      return {
        ...acc,
        [key]: (...args: unknown[]) => value(row, ...args),
      };
    }

    if (Array.isArray(value)) {
      return {
        ...acc,
        [key]: value.map((entry) => wrapWithRow(entry, row)),
      };
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {} as ContextMenuItem);
}
