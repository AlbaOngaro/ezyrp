import { get, has } from "lodash";
import { Fragment } from "react";
import { isWithinInterval } from "date-fns";
import { WEEKDAYS } from "../../constants";
import { getGridPosFromTime } from "../../helpers";
import { Day } from "../../types";
import { useSettings } from "hooks/useSettings";
import { Intervals } from "convex/settings";

type Props = {
  i: number;
  day: Day;
};

export function Overlay({ i, day }: Props) {
  const { data: settings } = useSettings();

  const { vacations = [] } = settings || {};

  if (
    vacations.some(({ start, end }) =>
      isWithinInterval(day.date, {
        start,
        end,
      }),
    )
  ) {
    return (
      <div
        className="bg-gray-100/30 pointer-events-none"
        style={{ gridRow: "1 / -1" }}
      />
    );
  }

  if (has(settings, `days.${WEEKDAYS[i]}`)) {
    return (
      <>
        {(get(settings, `days.${WEEKDAYS[i]}`, []) as Intervals).map(
          ({ start, end }, index, array) => {
            const hasMultipleIntervals = array.length > 1;

            if (hasMultipleIntervals) {
              if (index === 0) {
                return (
                  <Fragment key={index}>
                    <div
                      style={{
                        gridColumnStart: i + 1,
                        gridRow: `2 / ${getGridPosFromTime(start) * 12 + 2}`,
                      }}
                      className="bg-gray-100/30 pointer-events-none"
                    />

                    <div
                      style={{
                        gridColumnStart: i + 1,
                        gridRow: `${getGridPosFromTime(end) * 12 + 2} / ${
                          getGridPosFromTime(array[index + 1].start) * 12 + 2
                        }`,
                      }}
                      className="bg-gray-100/30 pointer-events-none"
                    />
                  </Fragment>
                );
              }

              if (index === array.length - 1) {
                return (
                  <div
                    key={index}
                    style={{
                      gridColumnStart: i + 1,
                      gridRow: `${getGridPosFromTime(end) * 12 + 2} / 288`,
                    }}
                    className="bg-gray-100/30 pointer-events-none"
                  />
                );
              }

              return (
                <Fragment key={index}>
                  <div
                    style={{
                      gridColumnStart: i + 1,
                      gridRow: `${getGridPosFromTime(end) * 12 + 2} / ${
                        getGridPosFromTime(array[index + 1].start) * 12 + 2
                      }`,
                    }}
                    className="bg-gray-100/30 pointer-events-none"
                  />
                </Fragment>
              );
            }

            return (
              <Fragment key={index}>
                <div
                  key={index}
                  style={{
                    gridColumnStart: i + 1,
                    gridRow: `2 / ${getGridPosFromTime(start) * 12 + 2}`,
                  }}
                  className="bg-gray-100/30 pointer-events-none"
                />

                <div
                  key={index}
                  style={{
                    gridColumnStart: i + 1,
                    gridRow: `${getGridPosFromTime(end) * 12 + 2} / 288`,
                  }}
                  className="bg-gray-100/30 pointer-events-none"
                />
              </Fragment>
            );
          },
        )}
      </>
    );
  }

  return (
    <div
      className="bg-gray-100/30 pointer-events-none"
      style={{
        gridColumnStart: i + 1,
        gridRow: "2 / -1",
      }}
    />
  );
}
