import * as RUISelect from "@radix-ui/react-select";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { twMerge } from "lib/utils/twMerge";

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface Props {
  name: string;
  label: string;
  description?: string;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
}

export function Select({
  name,
  label,
  description,
  options,
  className,
  onChange,
  defaultValue,
}: Props) {
  return (
    <RUISelect.Root
      defaultValue={defaultValue || options[0]?.value}
      onValueChange={onChange}
      name={name}
    >
      <fieldset className={twMerge("flex flex-col gap-2", className)}>
        {(label || description) && (
          <label className="flex flex-col text-sm font-bold text-gray-800">
            {label}
            {description && (
              <small className="text-sm font-normal text-dark-blue-gray">
                {description}
              </small>
            )}
          </label>
        )}
        <RUISelect.Trigger className="flex justify-between items-center m-0 resize-none py-2 px-4 text-sm bg-white rounded outline-none transition-all duration-300 border border-solid border-gray-300 focus:ring-0 focus:outline-none focus:border-gray-500 hover:border-gray-500 data-[invalid=true]:text-red-400 data-[invalid=true]:border-red-400">
          <RUISelect.Value placeholder="Select a fruit" />
          <RUISelect.Icon>
            <ChevronDownIcon />
          </RUISelect.Icon>
        </RUISelect.Trigger>

        <RUISelect.Portal>
          <RUISelect.Content
            position="popper"
            sideOffset={8}
            className="overflow-hidden bg-white rounded-md shadow-[0px_10px_40px_-7px_rgba(55,_63,_104,_0.35)] w-[var(--radix-select-trigger-width)] z-50"
          >
            <RUISelect.Viewport className="overflow-scroll max-h-40">
              {options.map((option) => (
                <RUISelect.Item
                  key={option.value}
                  disabled={option.disabled}
                  value={option.value}
                  className={twMerge(
                    "text-dark-800 px-4 py-1 flex items-center justify-between relative select-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:outline-none data-[highlighted]:bg-indigo-500 data-[highlighted]:text-white data-[disabled]:text-gray-300",
                  )}
                >
                  <RUISelect.ItemText>{option.label}</RUISelect.ItemText>
                  <RUISelect.ItemIndicator className="inline-flex items-center justify-center">
                    <CheckIcon />
                  </RUISelect.ItemIndicator>
                </RUISelect.Item>
              ))}
            </RUISelect.Viewport>
          </RUISelect.Content>
        </RUISelect.Portal>
      </fieldset>
    </RUISelect.Root>
  );
}
