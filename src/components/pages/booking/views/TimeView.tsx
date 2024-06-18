import {
  differenceInDays,
  format,
  isAfter,
  isSameDay,
  subMonths,
} from "date-fns";
import { Controller, useFormContext } from "react-hook-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { MonthWidget } from "components/atoms/month-widget";
import { useBookingContext } from "components/pages/booking/BookingPage";

export function TimeView() {
  const { today } = useBookingContext();
  const { control } = useFormContext();

  return (
    <Controller
      control={control}
      name="start"
      render={({ field: { value = new Date().toISOString(), onChange } }) => (
        <>
          <h3 className="text-lg font-bold col-span-6 self-end">
            Select a Date & Time
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
              onChange(date.toISOString());
            }}
            withNavigation
            showSelected={(date) => isSameDay(date, new Date(value))}
            isDayDisabled={(date) => {
              const diff = differenceInDays(date, today);

              if (diff < 0 || isSameDay(date, today)) {
                return true;
              }

              // const day = date.getDay() === 0 ? 6 : date.getDay() - 1;

              return true;
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
                onChange(date.toISOString());
              }}
            >
              <ol>
                {/* {data?.booking?.slots.map((slot) => {
                  const [hours, minutes] = slot.split(":").map(Number);

                  const item = `${(hours - new Date().getTimezoneOffset() / 60)
                    .toString()
                    .padStart(2, "0")}:${minutes.toString().padEnd(2, "0")}`;

                  return (
                    <li
                      key={slot}
                      className="grid grid-cols-2 gap-2 items-center"
                    >
                      <RadioGroup.Item
                        value={slot}
                        className="w-full text-center font-bold p-2 text-orange-400 border border-orange-400 rounded-sm cursor-pointer hover:bg-orange-50 focus:bg-orange-200 col-span-2  [&[data-state='checked']]:col-span-1 [&[data-state='checked']]:bg-orange-50 [&[data-state='checked']~button]:flex"
                      >
                        {item}
                      </RadioGroup.Item>
                      <Button
                        className="hidden items-center justify-center w-full h-full"
                        onClick={() => setView(View.Details)}
                      >
                        Next
                      </Button>
                    </li>
                  );
                })} */}
              </ol>
            </RadioGroup.Root>
          </div>
        </>
      )}
    />
  );
}
