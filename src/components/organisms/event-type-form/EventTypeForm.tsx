import { Form } from "@radix-ui/react-form";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { CheckIcon } from "@radix-ui/react-icons";
import { Controller, useFormContext } from "react-hook-form";

import { DURATION_OPTIONS, VARIANTS } from "./constants";
import { twMerge } from "lib/utils/twMerge";
import { Button } from "components/atoms/button";
import { Input } from "components/atoms/input";
import { TextArea } from "components/atoms/textarea";
import { Select } from "components/atoms/select";
import { Doc } from "convex/_generated/dataModel";

type Props = {
  className?: string;
};

type EventType = Doc<"eventTypes">;

export function EventTypeForm({ className }: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useFormContext<EventType>();

  return (
    <Form
      onSubmit={handleSubmit(console.debug, console.error)}
      className={twMerge("mt-2 flex flex-col gap-2", className)}
    >
      <Input label="Name" {...register("name", { required: true })} />

      <TextArea label="Description" {...register("description")} />

      <Controller
        control={control}
        name="duration"
        rules={{
          required: true,
        }}
        render={({ field: { value, onChange } }) => (
          <Select
            label="Duration"
            name="duration"
            defaultValue={
              DURATION_OPTIONS.find(
                (option) => option.value === value?.toString(),
              ) || DURATION_OPTIONS[0]
            }
            options={DURATION_OPTIONS}
            onChange={(option) => onChange(Number(option?.value))}
          />
        )}
      />

      <Controller
        control={control}
        name="variant"
        rules={{
          required: true,
        }}
        render={({ field: { value, onChange } }) => (
          <label className="flex flex-col gap-3 w-2/3 text-sm font-bold text-gray-800">
            Event color
            <RadioGroup.Root
              className="flex gap-2"
              value={value}
              onValueChange={(variant) => onChange(variant)}
              defaultValue={VARIANTS[0]}
            >
              {VARIANTS.map((variant) => (
                <RadioGroup.Item
                  key={variant}
                  className={twMerge(
                    "w-6 h-6 shrink-0 rounded-full opacity-100 transition-opacity duration-300 hover:opacity-80",
                    {
                      "bg-red-500": variant === "red",
                      "bg-orange-400": variant === "orange",
                      "bg-yellow-400": variant === "yellow",
                      "bg-lime-500": variant === "lime",
                      "bg-green-500": variant === "green",
                      "bg-emerald-500": variant === "emerald",
                      "bg-teal-500": variant === "teal",
                      "bg-cyan-500": variant === "cyan",
                      "bg-sky-500": variant === "sky",
                      "bg-blue-500": variant === "blue",
                      "bg-indigo-400": variant === "indigo",
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
        )}
      />

      <Button
        loading={isSubmitting}
        disabled={!isValid}
        size="lg"
        className="ml-auto px-6"
      >
        Save
      </Button>
    </Form>
  );
}
