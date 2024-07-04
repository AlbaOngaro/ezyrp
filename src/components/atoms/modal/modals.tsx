import { useEffect, useState } from "react";
import { createRoot, Root } from "react-dom/client";
import { Form } from "@radix-ui/react-form";
import { Input } from "../input";
import { Button } from "../button";
import { InputModalProps } from "./types";
import { Modal, ModalRoot } from ".";

function InputModal({
  onSubmit,
  inputProps,
  submitButtonProps: {
    children: submitButtonChildren,
    ...submitButtonProps
  } = {},
  ...props
}: InputModalProps) {
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => (document.body.style.pointerEvents = ""), 0);
    }
  }, [isOpen]);

  return (
    <ModalRoot open={isOpen} onOpenChange={setIsOpen}>
      {isOpen && (
        <Modal {...props} forceMount>
          <Form
            className="flex flex-col gap-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (typeof onSubmit === "function") {
                try {
                  setLoading(true);
                  await onSubmit(e);
                } catch (error) {
                  console.error(error);
                } finally {
                  setLoading(false);
                  setIsOpen(false);
                }
              }
            }}
          >
            <Input {...inputProps} />
            <Button
              className="ml-auto w-fit"
              type="submit"
              {...submitButtonProps}
              loading={loading}
            >
              {submitButtonChildren || "Submit"}
            </Button>
          </Form>
        </Modal>
      )}
    </ModalRoot>
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

function input(props: InputModalProps) {
  const container = document.getElementById("modal-root");
  if (!container) {
    return;
  }

  if (!root) {
    root = createRoot(container);
  }

  const key = keyGenerator.next().value as number;
  root.render(<InputModal {...props} key={key} />);
}

export { input };
