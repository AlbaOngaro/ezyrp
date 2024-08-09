import { Intervals } from "convex/settings";

export function getGridPosFromTime(time: string) {
  const [hours, minutes] = time.split(":").map((t) => parseInt(t, 10));
  return hours + minutes / 60;
}

export function getGridRowStartAndEnd(
  hasMultipleIntervals: boolean,
  isFirst: boolean,
  isLast: boolean,
  { start, end }: Intervals[number],
) {
  if (!hasMultipleIntervals) {
    return {
      start: `2 / ${getGridPosFromTime(start) * 12 + 2}`,
      end: `${getGridPosFromTime(end) * 12 + 2} / 288`,
    };
  }

  if (isFirst) {
    return {
      start: `2 / ${getGridPosFromTime(start) * 12 + 2}`,
      end: getGridPosFromTime(end) * 12 + 2,
    };
  }

  if (isLast) {
    return {
      start: getGridPosFromTime(start) * 12 + 2,
      end: `${getGridPosFromTime(end) * 12 + 2} / 288`,
    };
  }

  return {
    start: getGridPosFromTime(start) * 12 + 2,
    end: getGridPosFromTime(end) * 12 + 2,
  };
}
