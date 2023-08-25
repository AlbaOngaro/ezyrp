export type Day = {
  date: Date;
  events: {
    id: number;
    name: string;
    time: string;
    datetime: string;
    href: string;
  }[];
  isCurrentMonth?: boolean;
  isToday?: boolean;
  isSelected?: boolean;
};

export type View = "day" | "week" | "month" | "year";
