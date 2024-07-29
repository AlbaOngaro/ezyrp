import {
  addMinutes,
  differenceInDays,
  format,
  formatISO,
  isAfter,
  isSameDay,
  parseISO,
  subMonths,
} from "date-fns";
import { Controller, useFormContext } from "react-hook-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { FunctionReturnType } from "convex/server";
import { has } from "lodash";
import { View } from "../types";
import { MonthWidget } from "components/atoms/month-widget";
import { useBookingContext } from "components/pages/booking/BookingPage";
import { Button } from "components/atoms/button";
import { useQuery } from "lib/hooks/useQuery";
import { api } from "convex/_generated/api";
import { cn } from "lib/utils/cn";
import { WEEKDAYS } from "components/organisms/events-calendar/constants";

type Props = {
  slots: string[];
  eventType: FunctionReturnType<typeof api.eventTypes.get>;
};

export function TimeView({ slots, eventType: { duration } }: Props) {
  const { control, setValue } = useFormContext();
  const { today, setView } = useBookingContext();
  const { data: settings } = useQuery(api.settings.get);

  return (
    <Controller
      control={control}
      name="start"
      render={({
        field: { value = formatISO(new Date()), onChange: onFieldChange },
      }) => {
        const onChange = (value: string) => {
          setValue("end", formatISO(addMinutes(parseISO(value), duration)));
          onFieldChange(value);
        };

        return (
          <>
            <h3 className="text-lg font-bold col-span-6 self-end">
              Select a Date and Time
            </h3>

            <time
              dateTime={value}
              className="text-sm inline-block font-bold self-end col-start-8 col-end-13"
            >
              {format(new Date(value), "EEEE, MMMM dd")}
            </time>

            <MonthWidget
              className="col-span-6"
              date={new Date(value)}
              onDayClick={(date) => {
                onChange(formatISO(date));
              }}
              withNavigation
              showSelected={(date) => isSameDay(date, new Date(value))}
              isDayDisabled={(date) => {
                const diff = differenceInDays(date, today);

                if (diff < 0 || isSameDay(date, today)) {
                  return true;
                }

                const day = date.getDay() === 0 ? 6 : date.getDay() - 1;

                return !has(settings, `days.${WEEKDAYS[day]}`);
              }}
              isPrevDisabled={(date) => !isAfter(subMonths(date, 1), today)}
            />

            <div className="absolute row-start-2 col-start-8 col-end-13 h-full w-full overflow-y-auto">
              <RadioGroup.Root
                asChild
                className="flex flex-col gap-2 "
                onValueChange={(slot) => {
                  const [hours, minutes] = slot.split(":").map(Number);
                  const date = new Date(value);
                  date.setHours(hours, minutes);
                  onChange(formatISO(date));
                }}
              >
                <ol>
                  {slots.map((slot) => {
                    const checked = slot === format(new Date(value), "HH:mm");

                    return (
                      <li
                        key={slot}
                        className="grid grid-cols-2 gap-2 items-center"
                      >
                        <RadioGroup.Item
                          value={slot}
                          className={cn(
                            "w-full text-center font-bold p-2 text-gray-400 border border-gray-400 rounded-sm cursor-pointer hover:bg-gray-50 focus:bg-gray-200 col-span-2",
                            {
                              "col-span-1 bg-gray-50": checked,
                            },
                          )}
                          checked={checked}
                        >
                          {slot}
                        </RadioGroup.Item>
                        <Button
                          className={cn("hidden", {
                            "flex items-center justify-center w-full h-full":
                              checked,
                          })}
                          onClick={() => setView(View.Details)}
                        >
                          Next
                        </Button>
                      </li>
                    );
                  })}
                </ol>
              </RadioGroup.Root>
            </div>
          </>
        );
      }}
    />
  );
}
