import {
  Action,
  Cancel,
  Content,
  Description,
  Overlay,
  Portal,
  Root as DialogRoot,
  Title,
  Trigger as DialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { createRoot, Root } from "react-dom/client";
import { useState } from "react";

import { Props } from "./types";
import { cn } from "lib/utils/cn";
import { Button } from "components/atoms/button";

function Dialog({
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
  onOpenAutoFocus,
  forceMount,
  ...rest
}: Props) {
  return (
    <Portal forceMount={forceMount}>
      <Overlay
        className={cn(
          "bg-black opacity-40 fixed inset-0 z-40",
          overlayClassname,
        )}
      />
      <Content
        onOpenAutoFocus={onOpenAutoFocus}
        className={cn(
          "fixed z-40 top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none",
          className,
        )}
        {...rest}
      >
        <Title className="text-gray-800 m-0 font-medium">{title}</Title>
        {description && (
          <Description className="text-gray-700 mt-4 mb-5 leading-normal">
            {description}
          </Description>
        )}
        <div className="flex justify-end gap-4">
          <Cancel asChild>
            <Button
              variant="secondary"
              onClick={() => {
                setTimeout(() => (document.body.style.pointerEvents = ""), 0);

                if (typeof onCancel === "function") {
                  onCancel();
                }
              }}
              {...cancelButtonProps}
            >
              {cancelText}
            </Button>
          </Cancel>
          <Action asChild>
            <Button
              variant="destructive"
              onClick={() => {
                setTimeout(() => (document.body.style.pointerEvents = ""), 0);

                if (typeof onConfirm === "function") {
                  onConfirm();
                }
              }}
              {...confirmButtonProps}
            >
              {confirmText}
            </Button>
          </Action>
        </div>
      </Content>
    </Portal>
  );
}

function Wrapper({ onCancel, onConfirm, ...props }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <DialogRoot>
      {isOpen && (
        <Dialog
          {...props}
          onCancel={() => {
            if (typeof onCancel === "function") {
              onCancel();
            }

            setIsOpen(false);
          }}
          onConfirm={() => {
            if (typeof onConfirm === "function") {
              onConfirm();
            }

            setIsOpen(false);
          }}
          forceMount
        />
      )}
    </DialogRoot>
  );
}

function* generateKey() {
  let key = 0;
  while (true) {
    yield key++;
  }
}

const keyGenerator = generateKey();

let root: Root | null = null;

const dialogs = {
  warning: (props: Props) => {
    const container = document.getElementById("dialog-root");
    if (!container) {
      return;
    }

    if (!root) {
      root = createRoot(container);
    }

    const key = keyGenerator.next().value as number;
    root.render(
      <Wrapper
        {...props}
        confirmButtonProps={{ variant: "destructive" }}
        key={key}
      />,
    );
  },
  info: (props: Props) => {
    const container = document.getElementById("dialog-root");
    if (!container) {
      return;
    }

    if (!root) {
      root = createRoot(container);
    }

    const key = keyGenerator.next().value as number;
    root.render(
      <Wrapper
        {...props}
        confirmButtonProps={{
          variant: "default",
          className: "bg-blue-500 hover:bg-blue-600",
        }}
        key={key}
      />,
    );
  },
};

export { dialogs, Dialog, DialogRoot, DialogTrigger };
