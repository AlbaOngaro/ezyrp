import { Controller, useFormContext } from "react-hook-form";
import { get, isEmpty } from "lodash";
import { Plus, X } from "lucide-react";
import { addHours, format } from "date-fns";
import { Fragment } from "react";
import { Settings } from "./schema";
import { DAYS, HOURS } from "./constants";
import { Select } from "components/atoms/select";
import { Button } from "components/atoms/button";

type Props = {
  day: (typeof DAYS)[number];
};

export function Day({ day }: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext<Settings>();

  return (
    <Controller
      control={control}
      name={`days.${day.key}`}
      render={({ field: { name, onChange, value: intervals = [] } }) => (
        <fieldset name={name} className="grid grid-cols-5 gap-4 items-start">
          <label
            className="text-sm mt-2 uppercase font-semibold text-gray-800 flex flex-row items-center"
            htmlFor={day.key}
          >
            <input
              type="checkbox"
              className="w-4 h-4 mr-2"
              id={day.key}
              name={day.key}
              checked={!isEmpty(intervals)}
              onChange={() => {
                if (isEmpty(intervals)) {
                  return onChange([{ start: "09:00", end: "17:00" }]);
                }

                return onChange(undefined);
              }}
            />
            {day.label}
          </label>

          <div className="col-span-3 grid grid-cols-3 gap-y-2 gap-x-4">
            {isEmpty(intervals) ? (
              <span className="text-sm mt-2 text-muted-foreground">
                Unavailable
              </span>
            ) : (
              intervals.map((interval, i) => {
                const error = get(errors, `days.${day.key}.${i}`);

                return (
                  <>
                    <Select
                      name={name}
                      className="relative after:content-['-'] after:absolute after:top-1/2 after:-translate-y-1/2 after:-right-3 after:text-sm after:text-gray-500"
                      options={HOURS}
                      value={{
                        label: interval.start,
                        value: interval.start,
                      }}
                      onChange={(start) => {
                        if (start) {
                          onChange(
                            intervals.map((interval, j) => {
                              if (i === j) {
                                return { ...interval, start: start.value };
                              }

                              return interval;
                            }),
                          );
                        }
                      }}
                    />

                    <Select
                      name={name}
                      options={HOURS}
                      value={{
                        label: interval.end,
                        value: interval.end,
                      }}
                      onChange={(end) => {
                        if (end) {
                          onChange(
                            intervals.map((interval, j) => {
                              if (i === j) {
                                return { ...interval, end: end.value };
                              }

                              return interval;
                            }),
                          );
                        }
                      }}
                    />

                    <Button
                      variant="ghost"
                      className="w-10 h-10 p-0"
                      onClick={(e) => {
                        e.preventDefault();
                        onChange(intervals.filter((_, j) => i !== j));
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>

                    {error && (
                      <small className="col-span-3 text-red-500">
                        {error.message}
                      </small>
                    )}
                  </>
                );
              })
            )}
          </div>

          <Button
            variant="ghost"
            className="w-10 h-10 p-0"
            onClick={(e) => {
              e.preventDefault();
              if (!isEmpty(intervals)) {
                const last = intervals[intervals.length - 1];

                const start = addHours(new Date(`1970-01-01T${last.end}`), 1);
                const end = addHours(start, 1);

                return onChange([
                  ...intervals,
                  {
                    start: format(start, "HH:mm"),
                    end: format(end, "HH:mm"),
                  },
                ]);
              }

              return onChange([{ start: "09:00", end: "17:00" }]);
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </fieldset>
      )}
    />
  );
}
