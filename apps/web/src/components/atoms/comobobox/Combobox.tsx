import * as Popover from "@radix-ui/react-popover";
import * as Form from "@radix-ui/react-form";

import {
  ComponentPropsWithoutRef,
  JSXElementConstructor,
  KeyboardEventHandler,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { CaretSortIcon, Cross1Icon } from "@radix-ui/react-icons";

import { twMerge } from "../../../lib/utils/twMerge";

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface Props<O extends Option = Option>
  extends Omit<ComponentPropsWithoutRef<"input">, "onChange" | "options"> {
  label?: string;
  description?: string;
  className?: string;
  placeholder?: string;
  options: O[];
  onChange: (options: O[]) => void;
  filterOption?: (option: O, inputValue: string) => boolean;
  components?: Partial<{
    Value: JSXElementConstructor<{
      children: ReactNode;
      onRemove: () => void;
      option: O;
    }>;
  }>;
  name: string;
  validations?: Partial<Record<Form.ValidityMatcher, string>>;
}

function DefaultValue<O extends Option = Option>({
  children,
  onRemove,
}: {
  children: ReactNode;
  onRemove: () => void;
  option: O;
}) {
  return (
    <span className="flex flex-row items-center gap-2 py-1 px-2 bg-red-300 text-white rounded-sm transition-colors duration-300 hover:bg-red-400">
      {children}
      <button
        onClick={(e) => {
          e.preventDefault();
          onRemove();
        }}
      >
        <Cross1Icon />
      </button>
    </span>
  );
}

export function Combobox<O extends Option = Option>({
  label,
  description,
  className,
  placeholder,
  options,
  onChange,
  filterOption = (option, inputValue) =>
    option.value.toLowerCase().includes(inputValue),
  components,
  name,
  validations,
  ...rest
}: Props<O>) {
  const ul = useRef<HTMLUListElement | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<O[]>([]);

  const filteredOptions = options
    .filter((option) => !selected.includes(option))
    .filter((option) => filterOption(option, query));

  useEffect(() => {
    ul.current?.scrollTo({
      top: 32 * active,
      left: 0,
      behavior: "smooth",
    });
  }, [active]);

  useEffect(() => {
    onChange(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const handleKeyDown: KeyboardEventHandler<HTMLDivElement> = (e) => {
    switch (true) {
      case e.key === "ArrowDown": {
        e.preventDefault();
        setActive((curr) => {
          if (curr + 1 <= filteredOptions.length - 1) {
            return curr + 1;
          }

          return 0;
        });

        break;
      }
      case e.key === "ArrowUp": {
        e.preventDefault();
        setActive((curr) => {
          if (curr - 1 >= 0) {
            return curr - 1;
          }

          return filteredOptions.length - 1;
        });

        break;
      }
      case e.key === "Enter": {
        e.preventDefault();

        if (!filteredOptions[active].disabled) {
          setSelected((curr) => [...curr, filteredOptions[active]]);
          setQuery("");
          setActive(0);
          setIsOpen(false);
        }

        break;
      }
      case e.key === "Backspace": {
        if (!query) {
          e.preventDefault();
          setSelected((curr) => curr.slice(0, -1));
        }
        break;
      }
      default:
        break;
    }
  };

  const Value = !!components?.Value ? components.Value : DefaultValue;

  return (
    <Popover.Root open={isOpen}>
      <Popover.Anchor asChild>
        <Form.Field name={name} id={name} asChild>
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
            <fieldset className="relative flex flex-row flex-wrap items-center gap-2 m-0 resize-none py-2 px-4 pr-10 text-sm bg-white rounded outline-none transition-all duration-300 border border-solid border-gray-300 focus:ring-0 focus:outline-none focus:border-gray-500 hover:border-gray-500">
              {selected.map((option, i) => (
                <Value
                  option={option}
                  key={`${i}-${option.value.toLowerCase()}`}
                  onRemove={() =>
                    setSelected((curr) =>
                      curr.filter(
                        (o, y) =>
                          `${i}-${option.value.toLowerCase()}` !==
                          `${y}-${o.value.toLowerCase()}`,
                      ),
                    )
                  }
                >
                  {option.label}
                </Value>
              ))}

              <input
                type="text"
                className="border-none p-0 w-full flex-shrink-0 flex-grow basis-14 focus:ring-0 focus:outline-none"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpen(true);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsOpen(true)}
                placeholder={selected.length === 0 ? placeholder : undefined}
              />

              <Form.Control asChild>
                <input
                  aria-hidden
                  className="hidden"
                  type="text"
                  name={name}
                  list={`${name}-list`}
                  value={selected.map((s) => s.value).join(",")}
                  multiple
                  {...rest}
                />
              </Form.Control>
              <datalist
                aria-hidden="true"
                className="hidden"
                id={`${name}-list`}
              >
                {options.map((option) => (
                  <option key={option.value}>{option.label}</option>
                ))}
              </datalist>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  setQuery("");
                  setIsOpen(true);
                }}
                className="absolute right-3"
              >
                <CaretSortIcon className="h-5 w-5" />
              </button>
            </fieldset>

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
          </div>
        </Form.Field>
      </Popover.Anchor>
      <Popover.Content
        side="bottom"
        sideOffset={16}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={() => {
          setQuery("");
          setIsOpen(false);
        }}
        className="w-[var(--radix-popover-trigger-width)] max-h-24 rounded-sm overflow-scroll z-40 bg-white shadow-lg"
        asChild
      >
        <ul ref={ul}>
          {filteredOptions.length > 0 ? (
            <>
              {filteredOptions.map((option, i) => (
                <li
                  className={twMerge("w-full py-1 px-2 hover:bg-gray-100", {
                    "bg-gray-100": i === active,
                    "text-gray-400 cursor-not-allowed": option.disabled,
                  })}
                  key={option.value.toLowerCase()}
                  onClick={() => {
                    if (!option.disabled) {
                      setSelected((curr) => [...curr, option]);
                      setQuery("");
                      setActive(0);
                      setIsOpen(false);
                    }
                  }}
                >
                  {option.label}
                </li>
              ))}
            </>
          ) : (
            <li className="w-full py-1 px-2 text-center">No options</li>
          )}
        </ul>
      </Popover.Content>
    </Popover.Root>
  );
}
