import { Dispatch, SetStateAction } from "react";

export type Props = {
  eventtype: string;
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
