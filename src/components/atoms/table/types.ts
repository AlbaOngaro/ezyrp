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

export interface Row extends Record<string, unknown> {
  _id: string;
}

type FilterProps =
  | {
      filterable?: false;
      filterComponent?: never;
    }
  | {
      filterable: true;
      filterComponent: ReactNode;
    };

export type Column<R extends Row = Row> = {
  id: string;
  field: FlattenObjectKeys<R>;
  width?: number;
  headerName?: string;
  sortable?: boolean;
  render?: (row: R, index: number) => ReactNode;
  testId?: string;
} & FilterProps;

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

type Pagination = {
  status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
  pageSize: number;
  loadMore: () => void;
};

export type Props<R extends Row = Row> = {
  testId?: string;
  loading?: boolean;
  className?: string;
  columns: Column<R>[];
  rows: R[];
  withMultiSelect?: boolean;
  onSelect?: (rows: R[]) => void;
  renderSelectedActions?: (rows: Row[]) => ReactNode;
  contextMenuItems?: TableContextMenuItem<R>[];
  pagination?: Pagination;
};

export interface Sort<R extends Row = Row> {
  field: Extract<keyof R, string>;
  order: "ASC" | "DESC";
}
