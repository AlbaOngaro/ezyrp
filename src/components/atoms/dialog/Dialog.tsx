import * as RUIDialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { PropsWithChildren } from "react";

interface Props extends PropsWithChildren {
  title?: string;
  description?: string;
}

export function Dialog({ title, description, children }: Props) {
  return (
    <RUIDialog.Portal>
      <RUIDialog.Overlay className="bg-black opacity-40 fixed inset-0 z-40" />
      <RUIDialog.Content className="fixed z-40 top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none">
        {title && (
          <RUIDialog.Title className=" m-0 text-[17px] font-medium">
            {title}
          </RUIDialog.Title>
        )}
        {description && (
          <RUIDialog.Description className=" mt-[10px] mb-5 text-[15px] text-gray-600 leading-normal">
            {description}
          </RUIDialog.Description>
        )}
        {children}

        <RUIDialog.Close asChild>
          <button
            className="absolute top-[10px] right-[10px] inline-flex h-[25px] w-[25px] items-center justify-center"
            aria-label="Close"
          >
            <Cross2Icon />
          </button>
        </RUIDialog.Close>
      </RUIDialog.Content>
    </RUIDialog.Portal>
  );
}
