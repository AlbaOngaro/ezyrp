import { cva, VariantProps } from "class-variance-authority";

export const eventItemVariants = cva(
  "group flex cursor-pointer leading-5 text-xs p-2",
  {
    variants: {
      variant: {
        red: "bg-red-50 hover:bg-red-100 text-red-500",
        orange: "bg-orange-50 hover:bg-orange-100 text-orange-500",
        yellow: "bg-yellow-50 hover:bg-yellow-100 text-yellow-500",
        lime: "bg-lime-50 hover:bg-lime-100 text-lime-500",
        green: "bg-green-50 hover:bg-green-100 text-green-500",
        emerald: "bg-emerald-50 hover:bg-emerald-100 text-emerald-500",
        teal: "bg-teal-50 hover:bg-teal-100 text-teal-500",
        cyan: "bg-cyan-50 hover:bg-cyan-100 text-cyan-500",
        sky: "bg-sky-50 hover:bg-sky-100 text-sky-500",
        blue: "bg-blue-50 hover:bg-blue-100 text-blue-500",
        indigo: "bg-indigo-50 hover:bg-indigo-100 text-indigo-500",
        violet: "bg-violet-50 hover:bg-violet-100 text-violet-500",
        purple: "bg-purple-50 hover:bg-purple-100 text-purple-500",
        fuchsia: "bg-fuchsia-50 hover:bg-fuchsia-100 text-fuchsia-500",
        pink: "bg-pink-50 hover:bg-pink-100 text-pink-500",
        rose: "bg-rose-50 hover:bg-rose-100 text-rose-500",
      },
      view: {
        month: "group mt-10 h-fit justify-between gap-2 py-1 rounded-sm",
        year: "mt-px flex-col overflow-y-auto rounded-lg text-xs",
        day: "mt-px flex-col overflow-y-auto rounded-lg text-xs",
        week: "mt-px flex-col overflow-y-auto rounded-lg text-xs",
      },
      status: {
        approved: "",
        unapproved: "bg-white opacity-50 hover:bg-white",
      },
    },
    compoundVariants: [
      {
        status: "unapproved",
        variant: "red",
        className: "bg-white border border-red-500",
      },
      {
        status: "unapproved",
        variant: "orange",
        className: "bg-white border border-organge-500",
      },
      {
        status: "unapproved",
        variant: "yellow",
        className: "bg-white border border-yellow-500",
      },
      {
        status: "unapproved",
        variant: "lime",
        className: "bg-white border border-lime-500",
      },
      {
        status: "unapproved",
        variant: "green",
        className: "bg-white border border-green-500",
      },
      {
        status: "unapproved",
        variant: "emerald",
        className: "bg-white border border-emerald-500",
      },
      {
        status: "unapproved",
        variant: "teal",
        className: "bg-white border border-teal-500",
      },
      {
        status: "unapproved",
        variant: "cyan",
        className: "bg-white border border-cyan-500",
      },
      {
        status: "unapproved",
        variant: "sky",
        className: "bg-white border border-sky-500",
      },
      {
        status: "unapproved",
        variant: "blue",
        className: "bg-white border border-blue-500",
      },
      {
        status: "unapproved",
        variant: "indigo",
        className: "bg-white border border-indigo-500",
      },
      {
        status: "unapproved",
        variant: "violet",
        className: "bg-white border border-violet-500",
      },
      {
        status: "unapproved",
        variant: "purple",
        className: "bg-white border border-purple-500",
      },
      {
        status: "unapproved",
        variant: "fuchsia",
        className: "bg-white border border-fuchsia-500",
      },
      {
        status: "unapproved",
        variant: "pink",
        className: "bg-white border border-pink-500",
      },
      {
        status: "unapproved",
        variant: "rose",
        className: "bg-white border border-rose-500",
      },
    ],
    defaultVariants: {
      view: "month",
    },
  },
);

export type EventItemVariants = VariantProps<typeof eventItemVariants>;
