import { Cross1Icon } from "@radix-ui/react-icons";
import * as RUIToast from "@radix-ui/react-toast";
import { twMerge } from "lib/utils/twMerge";

interface Props {
  onClose: () => void;
  title: string;
  description?: string;
  variant?: "success" | "warning" | "info" | "error";
}

export function Toast({
  onClose,
  title,
  description,
  variant = "info",
}: Props) {
  return (
    <RUIToast.Root
      className={twMerge(
        "grid grid-cols-[1fr_1rem] items-start pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 p-4",
        {
          "border-green-400 border-t-4": variant === "success",
          "border-orange-400 border-t-4": variant === "warning",
          "border-cyan-400 border-t-4": variant === "info",
          "border-red-400 border-t-4": variant === "error",
        },
      )}
      open
      onOpenChange={(state) => {
        if (!state) {
          onClose();
        }
      }}
    >
      <section>
        <RUIToast.Title asChild className="text-sm font-medium text-gray-900">
          <p>{title}</p>
        </RUIToast.Title>
        {description && (
          <RUIToast.Description className="mt-1 text-sm text-gray-500" asChild>
            <p>{description}</p>
          </RUIToast.Description>
        )}
      </section>

      <button
        type="button"
        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        onClick={() => {
          onClose();
        }}
      >
        <span className="sr-only">Close</span>
        <Cross1Icon className="h-4 w-4" aria-hidden="true" />
      </button>
    </RUIToast.Root>
  );
}
