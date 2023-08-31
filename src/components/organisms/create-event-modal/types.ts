import { Dispatch, SetStateAction } from "react";
import { PopoverContentProps } from "@radix-ui/react-popover";

import { CreateEventInput } from "lib/types";

import { Props as ModalProps } from "components/atoms/modal/Modal";

type CreateEventModalProps = {
  as: "modal";
  onChange?: (event: CreateEventInput) => void;
} & Omit<ModalProps, "onChange">;

type CreateEventPopoverProps = {
  as: "popover";
  onChange?: (event: CreateEventInput) => void;
} & Omit<PopoverContentProps, "onChange">;

export type Props = {
  as?: "modal" | "popover";
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
  event?: CreateEventInput;
} & (CreateEventModalProps | CreateEventPopoverProps);
