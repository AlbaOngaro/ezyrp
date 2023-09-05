import { FormEventHandler, ReactNode, useEffect, useState } from "react";
import { Root as Form } from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import * as Popover from "@radix-ui/react-popover";
import { add, format, isAfter, roundToNearestMinutes, set } from "date-fns";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";

import { Props } from "./types";
import { InputCreateEventsArgs } from "__generated__/graphql";

import { Modal } from "components/atoms/modal/Modal";
import { useEvents } from "hooks/useEvents";
import { Input } from "components/atoms/input/Input";
import { Button } from "components/atoms/button/Button";
import { variants } from "server/schema/event";
import { twMerge } from "lib/utils/twMerge";
import { Combobox } from "components/atoms/comobobox/Combobox";
import { useCustomers } from "hooks/useCustomers";

function Value({
  children,
  onRemove,
}: {
  children: ReactNode;
  onRemove: () => void;
}) {
  return (
    <span className="flex flex-row gap-2 items-center bg-gray-100 py-1 px-2 rounded-sm">
      {children}
      <button
        className="border-l-gray-400 border-l-[1px] pl-2 opacity-100 transition-opacity duration-300 hover:opacity-50"
        onClick={onRemove}
      >
        <Cross1Icon className="h-3 w-3" />
      </button>
    </span>
  );
}

export function CreateEventModal({
  setIsOpen,
  as = "modal",
  className,
  event: initialEvent,
  onChange,
  ...rest
}: Props) {
  const events = useEvents();
  const customers = useCustomers();

  const [event, setEvent] = useState<InputCreateEventsArgs & { id: string }>(
    () => {
      if (initialEvent) {
        return {
          ...initialEvent,
          guests: initialEvent.guests.map((guest) => guest.id),
        };
      }

      const start = roundToNearestMinutes(new Date(), { nearestTo: 5 });

      return {
        id: crypto.randomUUID(),
        start: start.toISOString(),
        end: add(start, {
          hours: 1,
        }).toISOString(),
        title: "",
        variant: "blue",
        guests: [],
      };
    },
  );

  useEffect(() => {
    if (typeof onChange === "function") {
      onChange({
        ...event,
        guests: event.guests?.map((guest) => guest),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...rest } = event;
      await events.create({
        variables: {
          createEventsInput: [rest],
        },
      });
      setEvent(() => {
        const start = roundToNearestMinutes(new Date(), { nearestTo: 5 });

        return {
          id: crypto.randomUUID(),
          start: start.toISOString(),
          end: add(start, {
            hours: 1,
          }).toISOString(),
          title: "",
          variant: "blue",
          guests: [],
        };
      });
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setIsOpen(false);
    }
  };

  const Component = as === "modal" ? Modal : Popover.Content;

  return (
    <Component
      {...rest}
      className={twMerge(className, {
        "rounded-xl p-5 min-w-[300px] bg-white shadow-[0_24px_38px_3px_rgba(0,0,0,.14),_0_9px_46px_8px_rgba(0,0,0,.12),_0_11px_15px_-7px_rgba(0,0,0,.2)] z-10 focus-within:outline-none":
          as === "popover",
      })}
    >
      <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Title"
          name="title"
          required
          value={event.title}
          onChange={(e) =>
            setEvent((curr) => ({
              ...curr,
              title: e.target.value,
            }))
          }
          validations={{
            valueMissing: "This field is required",
          }}
        />

        <div className="flex flex-row gap-4">
          <Input
            className="min-w-0 w-full"
            label="Start"
            type="datetime-local"
            name="start"
            step={60 * 5} // 5 minutes
            value={format(new Date(event.start), "yyyy-MM-dd'T'HH:mm")}
            onChange={(start) => {
              setEvent((curr) => ({
                ...curr,
                start: start.toISOString(),
                end: isAfter(new Date(curr.end), start)
                  ? curr.end
                  : add(start, {
                      hours: 1,
                    }).toISOString(),
              }));
            }}
          />

          <Input
            className="min-w-0 w-full"
            label="End"
            type="datetime-local"
            name="end"
            step={60 * 5} // 5 minutes
            min={format(
              add(new Date(event.start), {
                minutes: 5,
              }),
              "yyyy-MM-dd'T'HH:mm",
            )}
            max={
              as === "popover"
                ? format(
                    set(new Date(event.start), {
                      hours: 23,
                      minutes: 59,
                    }),
                    "yyyy-MM-dd'T'HH:mm",
                  )
                : undefined
            }
            value={format(new Date(event.end), "yyyy-MM-dd'T'HH:mm")}
            onChange={(end) => {
              setEvent((curr) => ({
                ...curr,
                end: end.toISOString(),
              }));
            }}
            validations={{
              tooLong: "too long",
            }}
          />
        </div>

        {!customers.isLoading && customers.data && customers.data.customers && (
          <Combobox
            label="Guests"
            placeholder="Search for customer"
            options={customers.data.customers.results.map((customer) => ({
              label: customer.name,
              value: customer.id,
            }))}
            onChange={(options) =>
              setEvent((curr) => ({
                ...curr,
                guests: options.map((option) => option.value),
              }))
            }
            filterOption={(optiom, inputValue) =>
              optiom.label.toLowerCase().includes(inputValue.toLowerCase())
            }
            components={{
              Value,
            }}
          />
        )}

        <label className="flex flex-col gap-3 w-2/3 text-sm font-bold text-gray-800">
          Color
          <RadioGroup.Root
            className="grid grid-cols-8 gap-2"
            value={event.variant}
            onValueChange={(variant) =>
              setEvent((curr) => ({
                ...curr,
                variant,
              }))
            }
          >
            {variants.map((variant) => (
              <RadioGroup.Item
                key={variant}
                className={twMerge(
                  "w-6 h-6 rounded-full opacity-100 transition-opacity duration-300 hover:opacity-80",
                  {
                    "bg-red-500": variant === "red",
                    "bg-orange-500": variant === "orange",
                    "bg-yellow-500": variant === "yellow",
                    "bg-lime-500": variant === "lime",
                    "bg-green-500": variant === "green",
                    "bg-emerald-500": variant === "emerald",
                    "bg-teal-500": variant === "teal",
                    "bg-cyan-500": variant === "cyan",
                    "bg-sky-500": variant === "sky",
                    "bg-blue-500": variant === "blue",
                    "bg-indigo-500": variant === "indigo",
                    "bg-violet-500": variant === "violet",
                    "bg-purple-500": variant === "purple",
                    "bg-fuchsia-500": variant === "fuchsia",
                    "bg-pink-500": variant === "pink",
                    "bg-rose-500": variant === "rose",
                  },
                )}
                value={variant}
              >
                <RadioGroup.Indicator className="flex items-center justify-center w-full h-full relative text-white">
                  <CheckIcon />
                </RadioGroup.Indicator>
              </RadioGroup.Item>
            ))}
          </RadioGroup.Root>
        </label>

        <Button className="w-fit ml-auto" size="lg" type="submit">
          Create
        </Button>
      </Form>
    </Component>
  );
}
