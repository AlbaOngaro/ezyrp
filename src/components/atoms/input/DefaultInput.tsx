import * as Form from "@radix-ui/react-form";

import { forwardRef } from "react";
import { DefaultInputProps } from "./types";
import { cn } from "lib/utils/cn";

export const DefaultInput = forwardRef<HTMLInputElement, DefaultInputProps>(
  function DefaultInput(
    {
      label,
      description,
      validations,
      name,
      className,
      type,
      children,
      onChange,
      prefix,
      ...rest
    },
    ref,
  ) {
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

          <div className="flex flex-row">
            {prefix && (
              <span className="w-8 h-10 flex-shrink-0 bg-gray-200 flex justify-center items-center rounded-l">
                {prefix}
              </span>
            )}
            <Form.Control asChild>
              <input
                className={cn(
                  "m-0 w-full resize-none py-2 px-4 text-sm bg-white outline-none transition-all duration-300 border border-solid border-gray-300 focus:ring-0 focus:outline-none focus:border-gray-500 hover:border-gray-500 data-[invalid=true]:text-red-400 data-[invalid=true]:border-red-400",
                  {
                    "border-l-0 rounded-r": !!prefix,
                    rounded: !prefix,
                  },
                )}
                name={name}
                id={name}
                type={type}
                onChange={onChange}
                {...rest}
              />
            </Form.Control>
          </div>

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
