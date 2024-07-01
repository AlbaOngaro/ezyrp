import { CSSProperties } from "react";
import { CustomElement } from "types/slate";

interface BaseEditableField {
  type: string;
  label: string;
  defaultValue?: string | number | { label: string; value: string };
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
  defaultValue?: number;
  unit?: "px" | "%";
}

export type CustomEditableFieldRenderArgs = {
  element: CustomElement;
  onChange: (
    field: keyof CSSProperties,
    value: CSSProperties[keyof CSSProperties],
  ) => void;
};

interface CustomEditableField extends Omit<BaseEditableField, "label"> {
  type: "custom";
  render: ({ element, onChange }: CustomEditableFieldRenderArgs) => JSX.Element;
}

type EditableField =
  | EditableSelectField
  | EditableColorField
  | EditableNumberField
  | CustomEditableField;

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

export function isCustomEditableField(
  field: EditableField,
): field is CustomEditableField {
  return field.type === "custom";
}

export type EditableFields = {
  [Key in keyof CSSProperties]: EditableField;
};

export type Options = {
  exact?: boolean;
  editableFields?: EditableFields;
  actionsClassName?: string;
};
