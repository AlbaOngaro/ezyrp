import { cva } from "class-variance-authority";

export const eventTypeItemVariants = cva(
  "bg-white p-2 shadow-md rounded-md border-t-4",
  {
    variants: {
      variant: {
        red: "border-red-400",
        orange: "border-orange-400",
        yellow: "border-yellow-400",
        lime: "border-lime-400",
        green: "border-green-400",
        emerald: "border-emerald-400",
        teal: "border-teal-400",
        cyan: "border-cyan-400",
        sky: "border-sky-400",
        blue: "border-blue-400",
        indigo: "border-indigo-400",
        violet: "border-violet-400",
        purple: "border-purple-400",
        fuchsia: "border-fuchsia-400",
        pink: "border-pink-400",
        rose: "border-rose-400",
      },
    },
  },
);
