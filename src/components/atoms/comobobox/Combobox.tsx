import * as Popover from "@radix-ui/react-popover";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";

import { Cross1Icon } from "@radix-ui/react-icons";
import { twMerge } from "lib/utils/twMerge";

const options = ["Apple", "Banana", "Pear", "Grape", "Peach"];

export function Combobox() {
  const ul = useRef<HTMLUListElement | null>(null);

  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    ul.current?.scrollTo({
      top: 32 * active,
      left: 0,
      behavior: "smooth",
    });
  }, [active]);

  const filteredOptions = options
    .filter((option) => !selected.includes(option))
    .filter((option) => option.toLowerCase().includes(query));

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
        setSelected((curr) => [...curr, options[0]]);
        setQuery("");
        setActive(0);
        break;
      }
      default:
        break;
    }
  };

  return (
    <Popover.Root open={!!query}>
      <Popover.Anchor asChild>
        <fieldset className="relative flex flex-row flex-wrap items-center gap-2 m-0 resize-none py-2 px-4 text-sm bg-white rounded outline-none transition-all duration-300 border border-solid border-gray-300 focus:ring-0 focus:outline-none focus:border-gray-500 hover:border-gray-500">
          {selected.map((option) => (
            <span
              className="flex flex-row items-center gap-2 py-1 px-2 bg-red-300 text-white rounded-sm transition-colors duration-300 hover:bg-red-400"
              key={option.toLowerCase()}
            >
              {option}{" "}
              <button
                onClick={() =>
                  setSelected((curr) =>
                    curr.filter(
                      (o) => o.toLowerCase() !== option.toLowerCase(),
                    ),
                  )
                }
              >
                <Cross1Icon />
              </button>
            </span>
          ))}
          <input
            type="text"
            className="border-none p-0 w-full flex-shrink-0 flex-grow basis-64 focus:ring-0 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </fieldset>
      </Popover.Anchor>
      <Popover.Content
        side="bottom"
        sideOffset={16}
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={() => setQuery("")}
        className="w-[var(--radix-popover-trigger-width)] max-h-24 overflow-scroll z-40 bg-white shadow-lg"
        asChild
      >
        <ul ref={ul}>
          {filteredOptions.length > 0 ? (
            <>
              {filteredOptions.map((option, i) => (
                <li
                  className={twMerge("w-full py-1 px-2 hover:bg-gray-100", {
                    "bg-gray-100": i === active,
                  })}
                  key={option.toLowerCase()}
                  onClick={() => setSelected((curr) => [...curr, option])}
                >
                  {option}
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
