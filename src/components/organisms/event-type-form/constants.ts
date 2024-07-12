import { variant } from "convex/schema";

type Variant = typeof variant.type;

export const VARIANTS: readonly Variant[] = [
  "red",
  "orange",
  "yellow",
  "lime",
  "green",
  "emerald",
  "teal",
  "cyan",
  "sky",
  "blue",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
];

export const DURATION_OPTIONS = [
  {
    value: "15",
    label: "15 min",
  },
  {
    value: "30",
    label: "30 min",
  },
  {
    value: "45",
    label: "45 min",
  },
  {
    value: "60",
    label: "60 min",
  },
];
