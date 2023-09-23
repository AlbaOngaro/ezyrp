import { Dispatch, SetStateAction } from "react";
import { PopoverContentProps } from "@radix-ui/react-popover";

import { Props as ModalProps } from "../../atoms/modal/Modal";

import { Event, InputCreateEventsArgs } from "../../../__generated__/graphql";

type CreateEventModalProps = {
  as: "modal";
  onChange?: (event: InputCreateEventsArgs & { id: string }) => void;
} & Omit<ModalProps, "onChange">;

type CreateEventPopoverProps = {
  as: "popover";
  onChange?: (event: InputCreateEventsArgs & { id: string }) => void;
} & Omit<PopoverContentProps, "onChange">;

export type Props = {
  as?: "modal" | "popover";
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  className?: string;
  event?: Event;
} & (CreateEventModalProps | CreateEventPopoverProps);
