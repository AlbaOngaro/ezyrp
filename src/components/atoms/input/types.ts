import { ValidityMatcher } from "@radix-ui/react-form";
import { ChangeEventHandler, InputHTMLAttributes } from "react";

interface BaseInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  description?: string;
  validations?: Partial<Record<ValidityMatcher, string>>;
  name: string;
  type?:
    | "button"
    | "checkbox"
    | "color"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week"
    | "date"
    | "datetime-local";
}

export interface DateTimeInputProps extends BaseInputProps {
  type: "date" | "datetime-local";
  onChange?: (date: Date) => void;
}

export interface DefaultInputProps extends BaseInputProps {
  type?:
    | "button"
    | "checkbox"
    | "color"
    | "email"
    | "file"
    | "hidden"
    | "image"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "reset"
    | "search"
    | "submit"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export type Props = DefaultInputProps | DateTimeInputProps;

export function isDateTimeInputProps(
  props: Props,
): props is DateTimeInputProps {
  return props?.type === "date" || props?.type === "datetime-local";
}

export function isDefaultInputProps(props: Props): props is DefaultInputProps {
  return props?.type !== "date" && props?.type !== "datetime-local";
}
