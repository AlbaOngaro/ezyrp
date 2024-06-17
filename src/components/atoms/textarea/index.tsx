import * as Form from "@radix-ui/react-form";
import { TextareaHTMLAttributes, forwardRef, useEffect, useRef } from "react";
import { mergeRefs } from "lib/utils/mergeRefs";
import { cn } from "lib/utils/cn";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  validations?: Partial<Record<Form.ValidityMatcher, string>>;
  name: string;
  value?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, Props>(
  function TextArea(
    { label, description, validations, name, className, value, ...rest },
    ref,
  ) {
    const textarea = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
      if (textarea.current) {
        const rows = textarea.current.rows;
        const lines = value?.match(/\n/gi);

        if (lines && lines.length) {
          textarea.current.style.height = `${(lines.length + rows) * 1.25}rem`;
        } else {
          textarea.current.style.height = "auto";
        }
      }
    }, [value, textarea]);

    return (
      <Form.Field
        className={cn("flex flex-col gap-2 box-content", className)}
        name={name}
      >
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
          <textarea
            className="m-0 resize-none py-2 px-4 text-sm bg-white rounded outline-none transition-all duration-300 border border-solid border-gray-300 focus:ring-0 focus:outline-none focus:border-gray-500 hover:border-gray-500 data-[invalid=true]:text-red-400 data-[invalid=true]:border-red-400"
            name={name}
            ref={mergeRefs(textarea, ref)}
            value={value}
            {...rest}
          />
        </Form.Control>

        {validations &&
          Object.entries(validations).map(([match, message]) => (
            <Form.Message
              className="text-sm text-jasper"
              key={match}
              match={match as Form.ValidityMatcher}
            >
              {message}
            </Form.Message>
          ))}
      </Form.Field>
    );
  },
);
