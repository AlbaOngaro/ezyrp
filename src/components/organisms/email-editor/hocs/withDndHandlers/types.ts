import { CSSProperties } from "react";

type EditableField = {
  label: string;
  type: "color" | "number";
};

export type EditableFields = {
  [Key in keyof CSSProperties]: EditableField;
};

export type Options = {
  editableFields?: EditableFields;
};
