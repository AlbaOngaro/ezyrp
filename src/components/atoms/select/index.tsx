import RSelect, { Props as DefaultRSelecProps } from "react-select";
import CreatableRSelect, { CreatableProps } from "react-select/creatable";
import { GroupBase } from "react-select";

import { ChevronDownIcon } from "@radix-ui/react-icons";

import { X } from "lucide-react";
import { cn } from "lib/utils/cn";

type BaseProps = {
  name: string;
  label?: string;
  description?: string;
  isCreatable?: boolean;
};

type CreatableSelectProps<O> = BaseProps &
  CreatableProps<O, false, GroupBase<O>> & {
    isCreatable: true;
  };

type DefaultSelectProps<O> = BaseProps &
  DefaultRSelecProps<O, false, GroupBase<O>> & {
    isCreatable?: false;
  };

type Props<O = unknown> = CreatableSelectProps<O> | DefaultSelectProps<O>;

export function Select<O = unknown>({
  name,
  label,
  description,
  className,
  isCreatable = false,
  ...rest
}: Props<O>) {
  const Component = isCreatable ? CreatableRSelect : RSelect;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
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

      <Component
        unstyled
        name={name}
        components={{
          DropdownIndicator: ({ innerProps }) => (
            <span
              className="w-6 h-6 flex items-center justify-center"
              {...innerProps}
            >
              <ChevronDownIcon className="w-4 h-4" />
            </span>
          ),
          ClearIndicator: ({ innerProps }) => (
            <span
              className="w-6 h-6 flex items-center justify-center"
              {...innerProps}
            >
              <X className="w-4 h-4" />
            </span>
          ),
        }}
        classNames={{
          control: () =>
            "flex justify-between items-center m-0 resize-none py-2 pl-4 pr-2 text-sm bg-white rounded outline-none transition-all duration-300 border border-solid border-gray-300 focus:ring-0 focus:outline-none focus:border-gray-500 hover:border-gray-500 data-[invalid=true]:text-red-400 data-[invalid=true]:border-red-400",
          input: () =>
            "[&>input]:ring-0 [&>input]:!outline-none [&>input]:!ring-0",
          menuList: () =>
            "overflow-hidden mt-2 bg-white rounded-md shadow-[0px_10px_40px_-7px_rgba(55,_63,_104,_0.35)] w-[var(--radix-select-trigger-width)] z-50",
          option: ({ isSelected, isDisabled, isFocused }) =>
            cn(
              "text-dark-800 px-4 py-1 flex items-center justify-between relative select-none",
              {
                "bg-gray-400 text-white": isSelected,
                "bg-gray-300 text-white": isFocused,
                "text-gray-300 cursor-disallowed": isDisabled && !isSelected,
                "hover:outline-none hover:bg-gray-400 hover:text-white":
                  !isDisabled,
              },
            ),
        }}
        {...rest}
      />
    </div>
  );
}
