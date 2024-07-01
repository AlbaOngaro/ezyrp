import * as Form from "@radix-ui/react-form";
import { forwardRef, useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";

import {
  Popover,
  PopoverAnchor,
  PopoverArrow,
  PopoverContent,
} from "../popover";
import { ColorInputProps } from "./types";
import { cn } from "lib/utils/cn";

export const ColorPickerInput = forwardRef<HTMLInputElement, ColorInputProps>(
  function ColorPickerInput(
    { name, className, label, description, value, defaultValue, onChange },
    ref,
  ) {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

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

          <Popover
            open={isPopoverOpen}
            onOpenChange={(state) => {
              if (!state) {
                setIsPopoverOpen(false);
              }
            }}
          >
            <PopoverAnchor asChild>
              <div>
                <HexColorInput
                  color={value?.toString() || defaultValue?.toString()}
                  onChange={onChange}
                  className="m-0 w-full resize-none py-2 px-4 text-sm bg-white rounded outline-none transition-all duration-300 border border-solid border-gray-300 focus:ring-0 focus:outline-none focus:border-gray-500 hover:border-gray-500 data-[invalid=true]:text-red-400 data-[invalid=true]:border-red-400"
                  prefixed
                  onFocus={() => setIsPopoverOpen(true)}
                />
              </div>
            </PopoverAnchor>

            <PopoverContent asChild className="w-fit p-2">
              <div>
                <HexColorPicker
                  color={value?.toString() || defaultValue?.toString()}
                  onChange={onChange}
                />
                <PopoverArrow className="fill-gray-200" />
              </div>
            </PopoverContent>
          </Popover>
        </fieldset>
      </Form.Field>
    );
  },
);
