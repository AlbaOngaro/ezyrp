import { ContextMenuSubContentProps } from "@radix-ui/react-context-menu";
import { ReactNode } from "react";

interface ContextMenuLabelItem {
  type: "label";
  label: ReactNode;
}

interface ContextMenuBaseItem {
  type: "item";
  label: ReactNode;
  onClick: () => void;
}

interface ContextMenuGroupItem {
  type: "group";
  label: ReactNode;
  children: ContextMenuBaseItem[];
}

interface ContextMenuCheckboxItem {
  type: "checkbox";
  label: ReactNode;
  checked?: boolean;
  onCheckedChange?: (state: boolean) => void;
}

interface ContextMenuRadioItem {
  type: "radio";
  label: ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  children: {
    value: string;
    label: ReactNode;
  }[];
}

interface ContextMenuSeparatorItem {
  type: "separator";
}

interface ContextMenuSubItem {
  type: "sub";
  label: ReactNode;
  children: ContextMenuItem[];
}

export type ContextMenuItem =
  | ContextMenuLabelItem
  | ContextMenuBaseItem
  | ContextMenuGroupItem
  | ContextMenuCheckboxItem
  | ContextMenuRadioItem
  | ContextMenuSeparatorItem
  | ContextMenuSubItem;

export interface Props extends ContextMenuSubContentProps {
  items: ContextMenuItem[];
  type?: "sub";
}
