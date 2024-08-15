import * as RUIModal from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as modals from "./modals";
import { Props } from "./types";
import { cn } from "lib/utils/cn";

function Modal({
  title,
  description,
  children,
  forceMount,
  className,
  closeOnClickOutside = true,
}: Props) {
  return (
    <RUIModal.Portal forceMount={forceMount}>
      <RUIModal.Overlay className="bg-black opacity-40 fixed inset-0 z-40" />
      <RUIModal.Content
        onInteractOutside={(e) => {
          if (!closeOnClickOutside) {
            e.preventDefault();
            return;
          }

          setTimeout(() => (document.body.style.pointerEvents = ""), 0);
        }}
        className={cn(
          "fixed z-40 top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none",
          className,
        )}
      >
        {title && (
          <RUIModal.Title className=" m-0 text-[17px] font-medium">
            {title}
          </RUIModal.Title>
        )}
        {description && (
          <RUIModal.Description className=" mt-[10px] mb-5 text-[15px] text-gray-600 leading-normal">
            {description}
          </RUIModal.Description>
        )}
        {children}

        <RUIModal.Close asChild>
          <button
            className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] items-center justify-center"
            aria-label="Close"
            onClick={() => {
              setTimeout(() => (document.body.style.pointerEvents = ""), 0);
            }}
          >
            <Cross2Icon />
          </button>
        </RUIModal.Close>
      </RUIModal.Content>
    </RUIModal.Portal>
  );
}

const ModalRoot = ({ onOpenChange, ...props }: RUIModal.DialogProps) => (
  <RUIModal.Root
    {...props}
    onOpenChange={(open) => {
      if (!open) {
        setTimeout(() => (document.body.style.pointerEvents = ""), 0);
      }

      if (typeof onOpenChange === "function") {
        onOpenChange(open);
      }
    }}
  />
);

const ModalTrigger = RUIModal.Trigger;

export { modals, Modal, ModalRoot, ModalTrigger };
