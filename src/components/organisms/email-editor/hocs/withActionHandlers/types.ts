import { CSSProperties } from "react";

interface BaseEditableField {
  type: string;
  label: string;
  defaultValue: string | number | { label: string; value: string };
}

interface EditableSelectField extends BaseEditableField {
  type: "select";
  options: { label: string; value: string }[];
  defaultValue: { label: string; value: string };
}

interface EditableColorField extends BaseEditableField {
  type: "color";
  defaultValue: string;
}

interface EditableNumberField extends BaseEditableField {
  type: "number";
  defaultValue: number;
  unit?: "px" | "%";
}

type EditableField =
  | EditableSelectField
  | EditableColorField
  | EditableNumberField;

export function isEditableColorField(
  field: EditableField,
): field is EditableColorField {
  return field.type === "color";
}

export function isEditableNumberField(
  field: EditableField,
): field is EditableNumberField {
  return field.type === "number";
}

export function isEditableSelectField(
  field: EditableField,
): field is EditableSelectField {
  return field.type === "select";
}

export type EditableFields = {
  [Key in keyof CSSProperties]: EditableField;
};

export type Options = {
  editableFields?: EditableFields;
};
