import { ReactNode } from "react";

export interface Row extends Record<string, ReactNode> {
  id: string;
}

export interface Column<R extends Row = Row> {
  id: string;
  field: Extract<keyof R, string>;
  headerName?: string;
  sortable?: boolean;
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
  pagination?: Pagination;
}

export interface Sort<R extends Row = Row> {
  field: Extract<keyof R, string>;
  order: "ASC" | "DESC";
}
