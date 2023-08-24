import { ReactNode } from "react";
import { ContextMenuItem } from "components/organisms/context-menu/types";

export type FlattenObjectKeys<
  T extends Record<string, unknown>,
  Key = keyof T,
> = Key extends string
  ? T[Key] extends Record<string, unknown>
    ? `${Key}.${FlattenObjectKeys<T[Key]>}`
    : `${Key}`
  : never;

type Extract<T, U> = T extends U ? T : never;

export interface Row extends Record<string, ReactNode | Row> {
  id: string;
}

export interface Column<R extends Row = Row> {
  id: string;
  field: FlattenObjectKeys<R>;
  headerName?: string;
  sortable?: boolean;
  render?: (row: R) => ReactNode;
}

interface Pagination {
  initialPage?: number;
  pageSize?: number;
}

type TableContextMenuBaseItem<R extends Row = Row> = Omit<
  Extract<ContextMenuItem, { type: "item" }>,
  "onClick"
> & {
  onClick: (row: R) => void;
};

type TableContextMenuCheckboxItem<R extends Row = Row> = Extract<
  ContextMenuItem,
  { type: "checkbox" }
> & {
  onCheckedChange?: (row: R, state: boolean) => void;
};

type TableContextMenuRadioItem<R extends Row = Row> = Extract<
  ContextMenuItem,
  { type: "radio" }
> & {
  onValueChange?: (row: R, value: string) => void;
};

export type TableContextMenuItem<R extends Row = Row> =
  | Exclude<
      ContextMenuItem,
      { type: "item" } | { type: "checkbox" } | { type: "radio" }
    >
  | TableContextMenuBaseItem<R>
  | TableContextMenuCheckboxItem<R>
  | TableContextMenuRadioItem<R>;

export interface Props<R extends Row = Row> {
  className?: string;
  columns: Column<R>[];
  rows: R[];
  withMultiSelect?: boolean;
  onSelect?: (rows: R[]) => void;
  renderSelectedActions?: (rows: Row[]) => ReactNode;
  pagination?: Pagination;
  withContextMenu?: boolean;
  contextMenuItems?: TableContextMenuItem<R>[];
}

export interface Sort<R extends Row = Row> {
  field: Extract<keyof R, string>;
  order: "ASC" | "DESC";
}
