import { FormEvent, PropsWithChildren } from "react";

import { Props as InputProps } from "../input/types";
import { ButtonProps } from "../button";

export interface Props extends PropsWithChildren {
  title?: string;
  description?: string;
  className?: string;
  forceMount?: true;
  closeOnClickOutside?: boolean;
}

export interface InputModalProps extends Props {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  inputProps: InputProps;
  submitButtonProps?: ButtonProps;
}
