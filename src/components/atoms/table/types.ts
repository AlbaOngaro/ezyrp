import { ReactNode } from "react";

export type FlattenObjectKeys<
  T extends Record<string, unknown>,
  Key = keyof T,
> = Key extends string
  ? T[Key] extends Record<string, unknown>
    ? `${Key}.${FlattenObjectKeys<T[Key]>}`
    : `${Key}`
  : never;

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

export interface Props<R extends Row = Row> {
  className?: string;
  columns: Column<R>[];
  rows: R[];
  withMultiSelect?: boolean;
  onSelect?: (rows: R[]) => void;
  renderSelectedActions?: (rows: Row[]) => ReactNode;
  pagination?: Pagination;
}

export interface Sort<R extends Row = Row> {
  field: Extract<keyof R, string>;
  order: "ASC" | "DESC";
}
