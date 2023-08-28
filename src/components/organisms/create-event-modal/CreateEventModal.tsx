import { Dispatch, FormEventHandler, SetStateAction, useState } from "react";
import { Root as Form } from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";

import { add, format, isValid } from "date-fns";
import { CheckIcon } from "@radix-ui/react-icons";
import { Event } from "lib/types";

import { Modal } from "components/atoms/modal/Modal";
import { useEvents } from "hooks/useEvents";
import { Input } from "components/atoms/input/Input";
import { Button } from "components/atoms/button/Button";
import { variants } from "lib/schema/event";
import { twMerge } from "lib/utils/twMerge";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function CreateEventModal({ setIsOpen }: Props) {
  const events = useEvents();

  const [event, setEvent] = useState<Omit<Event, "id" | "workspace">>({
    start: new Date().toISOString(),
    end: add(new Date(), {
      hours: 0.5,
    }).toISOString(),
    title: "",
    variant: "blue",
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      await events.create(event);
      setEvent({
        start: new Date().toISOString(),
        end: add(new Date(), {
          hours: 0.5,
        }).toISOString(),
        title: "",
        variant: "blue",
      });
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <Modal>
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
            onChange={(e) => {
              if (isValid(new Date(e.target.value))) {
                setEvent((curr) => ({
                  ...curr,
                  start: new Date(e.target.value).toISOString(),
                  end: add(new Date(e.target.value), {
                    hours: 1,
                  }).toISOString(),
                }));
              }
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
            value={format(new Date(event.end), "yyyy-MM-dd'T'HH:mm")}
            onChange={(e) => {
              if (isValid(new Date(e.target.value))) {
                setEvent((curr) => ({
                  ...curr,
                  end: new Date(e.target.value).toISOString(),
                }));
              }
            }}
            validations={{
              tooLong: "too long",
            }}
          />
        </div>

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
    </Modal>
  );
}
