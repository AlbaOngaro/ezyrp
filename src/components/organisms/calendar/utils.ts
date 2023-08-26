import {
  differenceInHours,
  differenceInMinutes,
  eachDayOfInterval,
  isSameDay,
  isSameWeek,
} from "date-fns";

export function getEventStartRow(
  startDate: Date,
  endDate: Date,
  currentDate: Date,
) {
  const isLongerThan24Hours = differenceInHours(endDate, startDate) > 24;

  if (isLongerThan24Hours) {
    return 1;
  }

  if (isSameDay(startDate, currentDate)) {
    return (startDate.getHours() * 60) / 5 + 1 + startDate.getMinutes() / 5 + 1;
  }

  return 2;
}

function getEventEndRow(startDate: Date, endDate: Date, currentDate: Date) {
  const isLongerThan24Hours = differenceInHours(endDate, startDate) > 24;

  if (isLongerThan24Hours) {
    return 1;
  }

  if (!isSameDay(endDate, currentDate)) {
    return 288;
  }

  if (isSameDay(startDate, endDate)) {
    return differenceInMinutes(endDate, startDate) / 5;
  }

  return (endDate.getHours() * 60) / 5 + endDate.getMinutes() / 5;
}

export function getGridRow(startDate: Date, endDate: Date, currentDate: Date) {
  return `${getEventStartRow(
    startDate,
    endDate,
    currentDate,
  )} / span ${getEventEndRow(startDate, endDate, currentDate)}`;
}

export function getIsLongerThan24Hours(startDate: Date, endDate: Date) {
  return differenceInHours(endDate, startDate) > 24;
}

export function getGridColumn(
  startDate: Date,
  endDate: Date,
  currentDate: Date,
) {
  const isLongerThan24Hours = getIsLongerThan24Hours(startDate, endDate);

  if (
    isLongerThan24Hours &&
    isSameWeek(startDate, currentDate, {
      weekStartsOn: 1,
    })
  ) {
    return `${startDate.getDay() === 0 ? 7 : startDate.getDay()} / span ${
      eachDayOfInterval({
        start: startDate,
        end: endDate,
      }).length
    }`;
  }

  return currentDate.getDay() === 0 ? 7 : currentDate.getDay();
}
