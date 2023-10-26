import React from "react";
import { format } from "date-fns";
import { Controller, useFormContext } from "react-hook-form";

import { useRegisterContext } from "../RegisterPage";
import { FormData } from "../types";

import { Select } from "components/atoms/select/Select";
import { Button } from "components/atoms/button/Button";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

const HOURS = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i * 0.5);
  const minutes = (i % 2) * 30;

  const date = new Date();

  date.setHours(hours);
  date.setMinutes(minutes);

  return {
    label: format(date, "HH:mm"),
    value: i * 0.5,
  };
});

export function Schedule() {
  const {
    control,
    formState: { isSubmitting },
  } = useFormContext<FormData>();
  const { prev } = useRegisterContext();

  return (
    <React.Fragment>
      <div className="flex flex-row gap-2">
        <Controller
          control={control}
          name="start"
          rules={{
            required: true,
            shouldUnregister: false,
          }}
          render={({ field: { value = 0, onChange } }) => (
            <Select
              className="w-full"
              name="start"
              label="Work day starts at"
              // @ts-ignore
              options={HOURS}
              // @ts-ignore
              value={{
                value: value - new Date().getTimezoneOffset() / 60 || 0,
                label:
                  HOURS.find(
                    (h) =>
                      h.value === value - new Date().getTimezoneOffset() / 60,
                  )?.label || "",
              }}
              onChange={(option) =>
                onChange(
                  Number(option?.value) + new Date().getTimezoneOffset() / 60,
                )
              }
            />
          )}
        />

        <Controller
          control={control}
          name="end"
          rules={{
            required: true,
            shouldUnregister: false,
          }}
          render={({ field: { value = 0, onChange } }) => (
            <Select
              className="w-full"
              name="end"
              label="Work day ends at"
              // @ts-ignore
              options={HOURS}
              // @ts-ignore
              value={{
                value: value - new Date().getTimezoneOffset() / 60 || 0,
                label:
                  HOURS.find(
                    (h) =>
                      h.value === value - new Date().getTimezoneOffset() / 60,
                  )?.label || "",
              }}
              onChange={(option) =>
                onChange(
                  Number(option?.value) + new Date().getTimezoneOffset() / 60,
                )
              }
            />
          )}
        />
      </div>

      <Controller
        control={control}
        name="days"
        rules={{
          required: true,
          shouldUnregister: false,
        }}
        render={({ field: { value = [], onChange } }) => (
          <div className="flex flex-col gap-2">
            <label className="flex flex-col text-sm font-bold text-gray-800">
              Work week
            </label>
            <fieldset className="flex flex-row w-fit rounded-md border border-solid border-gray-300 overflow-hidden">
              {DAYS.map((day, i) => (
                <input
                  key={i}
                  type="checkbox"
                  value={day}
                  checked={value?.includes(i)}
                  onChange={() => {
                    if (value?.includes(i)) {
                      onChange(value.filter((v) => v !== i));
                      return;
                    }

                    onChange([...(value || []), i]);
                  }}
                  className="after:content-[attr(value)] after:absolute after:w-full after:h-full after:flex after:justify-center after:items-center cursor-pointer hover:[&:not(:checked)]:after:bg-orange-100 text-orange-400 checked:after:bg-orange-400 checked:after:text-white appearance-none relative w-8 h-8 flex items-center justify-center !outline-none border-l border-0 border-solid border-gray-300 [&:first-child]:border-none [&:first-child]:rounded-l-md [&:last-child]:rounded-r-md !ring-0 !shadow-none"
                />
              ))}
            </fieldset>
          </div>
        )}
      />

      <footer className="flex flex-row gap-2">
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={(e) => {
            e.preventDefault();
            prev();
          }}
        >
          Back
        </Button>
        <Button
          loading={isSubmitting}
          type="submit"
          size="lg"
          className="w-full"
        >
          Create account
        </Button>
      </footer>
    </React.Fragment>
  );
}
