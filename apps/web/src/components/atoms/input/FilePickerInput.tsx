import * as Form from "@radix-ui/react-form";

import { forwardRef } from "react";
import { ImageIcon } from "@radix-ui/react-icons";
import { twMerge } from "../../../lib/utils/twMerge";
import { DefaultInputProps } from "./types";

export const FilePickerInput = forwardRef<HTMLInputElement, DefaultInputProps>(
  function FilePickerInput(
    {
      className,
      name,
      label,
      description,
      type,
      onChange,
      validations,
      children,
      value,
      ...rest
    },
    ref,
  ) {
    return (
      <Form.Field
        ref={ref}
        className={twMerge("flex flex-col gap-2 w-fit", className)}
        name={name}
        asChild
      >
        <Form.Label htmlFor={name}>
          {(label || description) && (
            <span className="flex flex-col text-sm font-bold text-gray-800">
              {label}
              {description && (
                <small className="text-sm font-normal text-dark-blue-gray">
                  {description}
                </small>
              )}
            </span>
          )}

          {typeof value === "string" && !!value ? (
            <picture className="w-full min-w-[194px] block relative aspect-[1/1] rounded-xl overflow-hidden cursor-pointer after:hidden after:items-center after:justify-center after:text-sm after:text-center after:font-bold after:text-white after:bg-black/20 after:absolute after:inset-0 hover:after:flex hover:after:content-['Change_image']">
              <img
                src={value}
                alt="photoUrl"
                className="absolute inset-0 h-full w-full object-cover object-center"
              />
            </picture>
          ) : (
            <article className="w-[min(100%,193px)] cursor-pointer bg-orange-300 text-white aspect-[1/1] flex flex-col justify-center items-center gap-2 text-sm font-semibold leading-[150%] text-center transition-colors duration-300 rounded-xl hover:bg-orange-400">
              <ImageIcon /> + Upload Image
            </article>
          )}

          <Form.Control asChild>
            <input
              className="hidden"
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
        </Form.Label>
      </Form.Field>
    );
  },
);
