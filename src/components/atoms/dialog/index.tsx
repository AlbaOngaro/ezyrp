import * as AlertDialog from "@radix-ui/react-alert-dialog";

import { Props } from "./types";
import { cn } from "lib/utils/cn";
import { Button } from "components/atoms/button";

export function Dialog({
  title,
  description,
  className,
  overlayClassname,
  onCancel,
  cancelText = "Cancel",
  cancelButtonProps,
  onConfirm,
  confirmButtonProps,
  confirmText = "Confirm",
}: Props) {
  return (
    <AlertDialog.Portal>
      <AlertDialog.Overlay
        className={cn(
          "bg-black opacity-40 fixed inset-0 z-40",
          overlayClassname,
        )}
      />
      <AlertDialog.Content
        className={cn(
          "fixed z-40 top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none",
          className,
        )}
      >
        <AlertDialog.Title className="text-gray-800 m-0 font-medium">
          {title}
        </AlertDialog.Title>
        {description && (
          <AlertDialog.Description className="text-gray-700 mt-4 mb-5 leading-normal">
            {description}
          </AlertDialog.Description>
        )}
        <div className="flex justify-end gap-4">
          <AlertDialog.Cancel asChild>
            <Button
              variant="secondary"
              onClick={onCancel}
              {...cancelButtonProps}
            >
              {cancelText}
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action asChild>
            <Button
              variant="destructive"
              onClick={onConfirm}
              {...confirmButtonProps}
            >
              {confirmText}
            </Button>
          </AlertDialog.Action>
        </div>
      </AlertDialog.Content>
    </AlertDialog.Portal>
  );
}
