import { forwardRef } from "react";

import {
  Props,
  isColorInputProps,
  isDateTimeInputProps,
  isFilePickerInputProps,
} from "./types";

import { FilePickerInput } from "./FilePickerInput";
import { DateTimeInput } from "./DateTimeInput";
import { ColorPickerInput } from "./ColorPickerInput";
import { DefaultInput } from "./DefaultInput";

export const Input = forwardRef<HTMLInputElement, Props>(
  function Input(props, ref) {
    if (isDateTimeInputProps(props)) {
      return <DateTimeInput {...props} ref={ref} />;
    }

    if (isFilePickerInputProps(props)) {
      return <FilePickerInput {...props} ref={ref} />;
    }

    if (isColorInputProps(props)) {
      return <ColorPickerInput {...props} ref={ref} />;
    }

    return <DefaultInput {...props} ref={ref} />;
  },
);
