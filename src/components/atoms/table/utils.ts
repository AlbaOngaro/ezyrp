import { ContextMenuItem } from "../../organisms/context-menu/types";
import { Row, TableContextMenuItem } from "./types";

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

export function getGridTemplateColumns(
  colums: number,
  withContextMenu?: boolean,
  withMultiSelect?: boolean,
) {
  if (withContextMenu && withMultiSelect) {
    return `3rem repeat(${colums}, 1fr) 3rem`;
  }

  if (withContextMenu) {
    return `repeat(${colums}, 1fr) 3rem`;
  }

  if (withMultiSelect) {
    return `3rem repeat(${colums}, 1fr)`;
  }

  return `repeat(${colums}, 1fr)`;
}
