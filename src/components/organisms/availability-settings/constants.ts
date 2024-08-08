import { format } from "date-fns";

export const HOURS = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i * 0.5);
  const minutes = (i % 2) * 30;

  const date = new Date();

  date.setHours(hours);
  date.setMinutes(minutes);

  return {
    label: format(date, "HH:mm"),
    value: format(date, "HH:mm"),
  };
});

export const DAYS = [
  {
    key: "monday" as const,
    label: "Mon",
  },
  {
    key: "tuesday" as const,
    label: "Tue",
  },
  {
    key: "wednesday" as const,
    label: "Wed",
  },
  {
    key: "thursday" as const,
    label: "Thu",
  },
  {
    key: "friday" as const,
    label: "Fri",
  },
  {
    key: "saturday" as const,
    label: "Sat",
  },
  {
    key: "sunday" as const,
    label: "Sun",
  },
];
