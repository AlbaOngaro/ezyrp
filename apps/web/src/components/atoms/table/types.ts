import { ReactNode } from "react";
import { ContextMenuItem } from "../../organisms/context-menu/types";

export type FlattenObjectKeys<
  T extends Record<string, unknown>,
  Key = keyof T,
> = Key extends string
  ? T[Key] extends Record<string, unknown>
    ? `${Key}.${FlattenObjectKeys<T[Key]>}`
    : `${Key}`
  : never;

type Extract<T, U> = T extends U ? T : never;

export interface Row
  extends Record<string, ReactNode | Partial<Row> | Partial<Row>[]> {
  id: string;
}

export interface Column<R extends Row = Row> {
  id: string;
  field: FlattenObjectKeys<R>;
  headerName?: string;
  sortable?: boolean;
  render?: (row: R) => ReactNode;
}

export interface Pagination {
  initialPage?: number;
  pageSize?: number;
  total: number;
  onPageChange: ({ start, limit }: { start: number; limit: number }) => void;
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

type TableContextMenuSubItem<R extends Row = Row> = {
  type: "sub";
  label: ReactNode;
  children: TableContextMenuItem<R>[];
};

export type TableContextMenuItem<R extends Row = Row> =
  | Exclude<
      ContextMenuItem,
      | { type: "item" }
      | { type: "checkbox" }
      | { type: "radio" }
      | { type: "sub" }
    >
  | TableContextMenuBaseItem<R>
  | TableContextMenuCheckboxItem<R>
  | TableContextMenuRadioItem<R>
  | TableContextMenuSubItem<R>;

export interface Props<R extends Row = Row> {
  loading?: boolean;
  className?: string;
  columns: Column<R>[];
  rows: R[];
  withMultiSelect?: boolean;
  onSelect?: (rows: R[]) => void;
  renderSelectedActions?: (rows: Row[]) => ReactNode;
  withContextMenu?: boolean;
  contextMenuItems?: TableContextMenuItem<R>[];
  withPagination?: boolean;
  pagination?: Pagination;
}

export interface Sort<R extends Row = Row> {
  field: Extract<keyof R, string>;
  order: "ASC" | "DESC";
}
