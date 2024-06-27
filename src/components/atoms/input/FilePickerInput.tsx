import * as Form from "@radix-ui/react-form";

import { forwardRef } from "react";
import { ImageIcon } from "@radix-ui/react-icons";
import { Card } from "../card";
import { FilePickerInputProps } from "./types";
import { cn } from "lib/utils/cn";

export const FilePickerInput = forwardRef<
  HTMLInputElement,
  FilePickerInputProps
>(function FilePickerInput(
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
    alt,
    pictureStyle,
    pictureClassName,
    imageClassName,
    imgStyle,
    ...rest
  },
  ref,
) {
  return (
    <Form.Field
      ref={ref}
      className={cn("flex flex-col gap-2 w-fit", className)}
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

        {typeof value === "string" ? (
          <picture
            style={pictureStyle}
            className={cn(
              "relative rounded-xl overflow-hidden cursor-pointer after:hidden after:items-center after:justify-center after:text-sm after:text-center after:font-bold after:text-white after:bg-black/20 after:absolute after:inset-0 hover:after:flex hover:after:content-['Change_image']",
              pictureClassName,
            )}
          >
            <img
              src={value}
              alt={alt}
              style={imgStyle}
              className={cn(
                "relative w-auto h-auto object-contain aspect-auto",
                imageClassName,
              )}
            />
          </picture>
        ) : (
          <Card className="w-[193px] cursor-pointer aspect-[1/1] flex flex-col justify-center items-center gap-2 text-sm font-semibold leading-[150%] text-center transition-colors duration-300 rounded-xl">
            <ImageIcon /> + Upload Image
          </Card>
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
});
