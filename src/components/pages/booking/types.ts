import { Dispatch, SetStateAction } from "react";
import { Id } from "convex/_generated/dataModel";

export type Props = {
  eventtype: Id<"eventTypes">;
};

export enum View {
  Time,
  Details,
  Success,
}

export type BookingContextValue = {
  view: View;
  setView: Dispatch<SetStateAction<View>>;
  today: Date;
};
