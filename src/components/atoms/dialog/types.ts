import { Props as ButtonProps } from "../button";

export interface Props {
  title: string;
  description?: string;
  overlayClassname?: string;
  className?: string;
  cancelButtonProps?: Omit<ButtonProps, "onClick">;
  cancelText?: string;
  onCancel?: () => void;
  confirmButtonProps?: Omit<ButtonProps, "onClick">;
  confirmText?: string;
  onConfirm?: () => void;
}
