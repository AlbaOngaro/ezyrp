import RSelect, { CreatableProps } from "react-select/creatable";
import { GroupBase } from "react-select";

import { ChevronDownIcon } from "@radix-ui/react-icons";

import { twMerge } from "lib/utils/twMerge";

interface Option {
  label: string;
  value: string;
}

interface Props extends CreatableProps<Option, false, GroupBase<Option>> {
  name: string;
  label?: string;
  description?: string;
}

export function Select({
  name,
  label,
  description,
  className,
  ...rest
}: Props) {
  return (
    <div className={twMerge("flex flex-col gap-2", className)}>
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

      <RSelect
        unstyled
        name={name}
        components={{
          DropdownIndicator: () => <ChevronDownIcon />,
        }}
        classNames={{
          control: () =>
            "flex justify-between items-center m-0 resize-none py-2 px-4 text-sm bg-white rounded outline-none transition-all duration-300 border border-solid border-gray-300 focus:ring-0 focus:outline-none focus:border-gray-500 hover:border-gray-500 data-[invalid=true]:text-red-400 data-[invalid=true]:border-red-400",
          input: () =>
            "[&>input]:ring-0 [&>input]:!outline-none [&>input]:!ring-0",
          menuList: () =>
            "overflow-hidden mt-2 bg-white rounded-md shadow-[0px_10px_40px_-7px_rgba(55,_63,_104,_0.35)] w-[var(--radix-select-trigger-width)] z-50",
          option: ({ isSelected, isDisabled, isFocused }) =>
            twMerge(
              "text-dark-800 px-4 py-1 flex items-center justify-between relative select-none",
              {
                "bg-orange-400 text-white": isSelected,
                "bg-orange-300 text-white": isFocused,
                "text-gray-300 cursor-disallowed": isDisabled && !isSelected,
                "hover:outline-none hover:bg-orange-400 hover:text-white":
                  !isDisabled,
              },
            ),
        }}
        {...rest}
      />
    </div>
  );
}
