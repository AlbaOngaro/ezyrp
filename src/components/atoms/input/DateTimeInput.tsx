import { forwardRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import * as Form from "@radix-ui/react-form";
import { CalendarIcon } from "@radix-ui/react-icons";

import {
  format,
  getDate,
  getDaysInMonth,
  getMonth,
  getYear,
  setDate,
  setMonth,
  setYear,
} from "date-fns";
import { DateTimeInputProps } from "./types";
import { MonthWidget } from "components/atoms/month-widget";
import { cn } from "lib/utils/cn";

export const DateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
  function DateTimeInput(
    {
      value,
      label,
      description,
      validations,
      name,
      className,
      children,
      onChange,
    },
    ref,
  ) {
    const [isOpen, setIsOpen] = useState(false);

    const date = value ? new Date(value as string) : new Date();

    return (
      <Form.Field
        ref={ref}
        className={cn("flex flex-col gap-2", className)}
        name={name}
        id={name}
        asChild
      >
        <fieldset>
          {(label || description) && (
            <Form.Label className="flex flex-col text-sm font-bold text-gray-800">
              {label}
              {description && (
                <small className="text-sm font-normal text-dark-blue-gray">
                  {description}
                </small>
              )}
            </Form.Label>
          )}

          <Form.Control asChild>
            <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
              <fieldset
                name={name}
                className="relative w-full flex flex-row items-baseline m-0 py-2 px-4 text-sm bg-white rounded outline-none transition-all duration-300 border border-solid border-gray-300 focus:ring-0 focus:outline-none focus:border-gray-500 hover:border-gray-500 data-[invalid=true]:text-red-400 data-[invalid=true]:border-red-400"
              >
                <input
                  className="text-center p-0 border-none !ring-0 !outline-nonde [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                  type="number"
                  style={{
                    width: `${getDate(date).toString().length}ch`,
                  }}
                  value={getDate(date)}
                  onChange={(e) => {
                    if (typeof onChange === "function") {
                      const day = Number(e.target.value);
                      if (day > getDaysInMonth(date)) {
                        onChange(setDate(date, 1));
                      } else if (day < 1) {
                        onChange(setDate(date, getDaysInMonth(date)));
                      } else {
                        onChange(setDate(date, day));
                      }
                    }
                  }}
                />
                .
                <input
                  className="text-center p-0 border-none !ring-0 !outline-nonde [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                  type="number"
                  style={{
                    width: `${(getMonth(date) + 1).toString().length}ch`,
                  }}
                  value={getMonth(date) + 1}
                  onChange={(e) => {
                    if (typeof onChange === "function") {
                      const month = Number(e.target.value);

                      if (month > 12) {
                        onChange(setMonth(date, 0));
                      } else if (month < 1) {
                        onChange(setMonth(date, 11));
                      } else {
                        onChange(setMonth(date, month - 1));
                      }
                    }
                  }}
                />
                .
                <input
                  className="text-center p-0 border-none !ring-0 !outline-nonde [&::-webkit-inner-spin-button]:hidden [&::-webkit-outer-spin-button]:hidden"
                  type="number"
                  style={{
                    width: `${getYear(date).toString().length}ch`,
                  }}
                  value={getYear(date)}
                  pattern="[0-9]{4}"
                  onChange={(e) => {
                    if (typeof onChange === "function") {
                      const year = Number(e.target.value);
                      onChange(setYear(date, year));
                    }
                  }}
                />
                <Popover.Anchor asChild>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setIsOpen(true);
                    }}
                    className="absolute bg-white pl-2 right-4 top-1/2 -translate-y-1/2"
                  >
                    <CalendarIcon />
                  </button>
                </Popover.Anchor>
              </fieldset>

              <Popover.Content
                className="rounded p-5 w-[300px] bg-white shadow-2xl z-10"
                sideOffset={8}
                align="end"
              >
                <MonthWidget
                  date={date}
                  withNavigation
                  showSelected={(newDate) =>
                    format(date, "dd/MM/yyyy") === format(newDate, "dd/MM/yyyy")
                  }
                  onDayClick={(selected) => {
                    if (typeof onChange === "function") {
                      onChange(selected);
                    }

                    setIsOpen(false);
                  }}
                />
              </Popover.Content>
            </Popover.Root>
          </Form.Control>

          {validations &&
            Object.entries(validations).map(([match, message]) => (
              <Form.Message
                className="text-xs text-red-400"
                key={match}
                match={match as Form.ValidityMatcher}
              >
                {message}
              </Form.Message>
            ))}

          {children}
        </fieldset>
      </Form.Field>
    );
  },
);
