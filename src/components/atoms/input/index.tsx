import * as Form from "@radix-ui/react-form";
import { forwardRef } from "react";
import { HexColorInput } from "react-colorful";

import { Props, isColorInputProps, isDateTimeInputProps } from "./types";

import { FilePickerInput } from "./FilePickerInput";
import { DateTimeInput } from "./DateTimeInput";
import { cn } from "lib/utils/cn";

export const Input = forwardRef<HTMLInputElement, Props>(
  function Input(props, ref) {
    if (isDateTimeInputProps(props)) {
      const {
        label,
        description,
        validations,
        name,
        className,
        type,
        children,
        onChange,
        ...rest
      } = props;

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
              <DateTimeInput
                name={name}
                id={name}
                type={type}
                onChange={(date: Date) => {
                  if (typeof onChange === "function") {
                    onChange(date);
                  }
                }}
                {...rest}
              />
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
    }

    if (isColorInputProps(props)) {
      const {
        type: _type,
        name,
        className,
        label,
        description,
        ...rest
      } = props;

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
              <HexColorInput
                {...rest}
                color={props.value?.toString()}
                className="m-0 w-full resize-none py-2 px-4 text-sm bg-white rounded outline-none transition-all duration-300 border border-solid border-gray-300 focus:ring-0 focus:outline-none focus:border-gray-500 hover:border-gray-500 data-[invalid=true]:text-red-400 data-[invalid=true]:border-red-400"
                prefixed
              />
            </Form.Control>
          </fieldset>
        </Form.Field>
      );
    }

    const {
      label,
      description,
      validations,
      name,
      className,
      type,
      children,
      onChange,
      ...rest
    } = props;

    if (type === "file") {
      return <FilePickerInput {...props} />;
    }

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
            <input
              className="m-0 w-full resize-none py-2 px-4 text-sm bg-white rounded outline-none transition-all duration-300 border border-solid border-gray-300 focus:ring-0 focus:outline-none focus:border-gray-500 hover:border-gray-500 data-[invalid=true]:text-red-400 data-[invalid=true]:border-red-400"
              name={name}
              id={name}
              type={type}
              onChange={onChange}
              {...rest}
            />
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
