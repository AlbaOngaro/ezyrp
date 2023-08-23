import { ContextMenuSubContentProps } from "@radix-ui/react-context-menu";
import { ReactElement } from "react";

interface ContextMenuLabelItem {
  type: "label";
  label: ReactElement;
}

interface ContextMenuBaseItem {
  type: "item";
  label: ReactElement;
  onClick: () => void;
}

interface ContextMenuGroupItem {
  type: "group";
  label: ReactElement;
  children: ContextMenuBaseItem[];
}

interface ContextMenuCheckboxItem {
  type: "checkbox";
  label: ReactElement;
  checked?: boolean;
  onCheckedChange?: (state: boolean) => void;
}

interface ContextMenuRadioItem {
  type: "radio";
  label: ReactElement;
  value: string;
  onValueChange: (value: string) => void;
  children: {
    value: string;
    label: ReactElement;
  }[];
}

interface ContextMenuSeparatorItem {
  type: "separator";
}

interface ContextMenuSubItem {
  type: "sub";
  label: ReactElement;
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
