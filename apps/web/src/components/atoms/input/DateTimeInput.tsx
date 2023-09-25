import { forwardRef, useRef, useState } from "react";
import * as Form from "@radix-ui/react-form";
import * as Popover from "@radix-ui/react-popover";
import { CalendarIcon } from "@radix-ui/react-icons";

import { format, isValid } from "date-fns";
import { mergeRefs } from "../../../lib/utils/mergeRefs";
import { MonthWidget } from "../month-widget/MonthWidget";
import { DateTimeInputProps } from "./types";

export const DateTimeInput = forwardRef<HTMLInputElement, DateTimeInputProps>(
  function DateTimeInput({ name, type, onChange, ...rest }, ref) {
    const input = useRef<HTMLInputElement | null>(null);

    const date = input.current?.value
      ? new Date(input.current?.value)
      : new Date();

    const [isOpen, setIsOpen] = useState(false);

    return (
      <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
        <Popover.Anchor>
          <div className="relative">
            <Form.Control asChild>
              <input
                ref={mergeRefs(input, ref)}
                className="w-full m-0 resize-none py-2 px-4 text-sm bg-white rounded outline-none transition-all duration-300 border border-solid border-gray-300 focus:ring-0 focus:outline-none focus:border-gray-500 hover:border-gray-500 data-[invalid=true]:text-red-400 data-[invalid=true]:border-red-400"
                name={name}
                id={name}
                type={type}
                onClick={(e) => {
                  e.preventDefault();
                }}
                onChange={(e) => {
                  if (typeof onChange === "function") {
                    if (isValid(new Date(e.target.value))) {
                      onChange(new Date(e.target.value));
                    }
                  }
                }}
                {...rest}
              />
            </Form.Control>
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(true);
              }}
              className="absolute bg-white pl-2 right-4 top-1/2 -translate-y-1/2"
            >
              <CalendarIcon />
            </button>
          </div>
        </Popover.Anchor>
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
              if (input.current) {
                input.current.value = format(
                  selected,
                  type === "datetime-local"
                    ? "yyyy-MM-dd'T'HH:mm"
                    : "yyyy-MM-dd",
                );

                if (typeof onChange === "function") {
                  onChange(selected);
                }
              }

              setIsOpen(false);
            }}
          />
        </Popover.Content>
      </Popover.Root>
    );
  },
);
