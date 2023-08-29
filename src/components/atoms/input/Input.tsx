import * as Form from "@radix-ui/react-form";
import * as Popover from "@radix-ui/react-popover";

import { CalendarIcon } from "@radix-ui/react-icons";
import { InputHTMLAttributes, forwardRef, useRef, useState } from "react";

import { format } from "date-fns";
import { twMerge } from "lib/utils/twMerge";
import { MonthWidget } from "components/atoms/month-widget/MonthWidget";
import { mergeRefs } from "lib/utils/mergeRefs";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  validations?: Partial<Record<Form.ValidityMatcher, string>>;
  name: string;
}

const DateTimeInput = forwardRef<HTMLInputElement, Props>(
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
            <input
              ref={mergeRefs(input, ref)}
              className="w-full m-0 resize-none py-2 px-4 text-sm bg-white rounded outline-none transition-all duration-300 border border-solid border-gray-300 focus:ring-0 focus:outline-none focus:border-gray-500 hover:border-gray-500 data-[invalid=true]:text-red-400 data-[invalid=true]:border-red-400"
              name={name}
              id={name}
              type={type}
              onClick={(e) => {
                e.preventDefault();
              }}
              onChange={onChange}
              {...rest}
            />
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
          align="center"
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
                  onChange({
                    target: input.current,
                    // @ts-ignore
                    nativeEvent: undefined,
                    currentTarget: input.current,
                    bubbles: false,
                    cancelable: false,
                    defaultPrevented: false,
                    eventPhase: 0,
                    isTrusted: false,
                    preventDefault: function (): void {
                      throw new Error("Function not implemented.");
                    },
                    isDefaultPrevented: function (): boolean {
                      throw new Error("Function not implemented.");
                    },
                    stopPropagation: function (): void {
                      throw new Error("Function not implemented.");
                    },
                    isPropagationStopped: function (): boolean {
                      throw new Error("Function not implemented.");
                    },
                    persist: function (): void {
                      throw new Error("Function not implemented.");
                    },
                    timeStamp: 0,
                    type: "",
                  });
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

export const Input = forwardRef<HTMLInputElement, Props>(function Input(
  {
    label,
    description,
    validations,
    name,
    className,
    type = "text",
    children,
    ...rest
  },
  ref,
) {
  return (
    <Form.Field
      ref={ref}
      className={twMerge("flex flex-col gap-2", className)}
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
          {["date", "datetime-local"].includes(type) ? (
            <DateTimeInput name={name} id={name} type={type} {...rest} />
          ) : (
            <input
              className="m-0 resize-none py-2 px-4 text-sm bg-white rounded outline-none transition-all duration-300 border border-solid border-gray-300 focus:ring-0 focus:outline-none focus:border-gray-500 hover:border-gray-500 data-[invalid=true]:text-red-400 data-[invalid=true]:border-red-400"
              name={name}
              id={name}
              type={type}
              {...rest}
            />
          )}
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
});
