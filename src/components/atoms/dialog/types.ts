import { Props as ButtonProps } from "components/atoms/button/Button";

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
