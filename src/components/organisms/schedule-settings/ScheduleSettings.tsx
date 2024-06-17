import { Form } from "@radix-ui/react-form";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "convex/react";
import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";
import { Select } from "components/atoms/select/Select";
import { Button } from "components/atoms/button/Button";
import { useLazyQuery } from "lib/hooks/useLazyQuery";
import { api } from "convex/_generated/api";

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

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function ScheduleSettings() {
  const [loadSettings] = useLazyQuery(api.settings.get);
  const updateSettings = useMutation(api.settings.update);

  const {
    control,
    handleSubmit,
    formState: { isValid, isSubmitting },
  } = useForm({
    defaultValues: async () => {
      const settings = await loadSettings();

      if (!settings) {
        return {
          start: 0,
          end: 0,
          days: [],
        };
      }

      return {
        start: settings?.start || 0,
        end: settings?.end || 0,
        days: settings?.days || [],
      };
    },
  });

  return (
    <Container className="grid grid-cols-[1fr_2fr] py-12 gap-x-4 max-w-none h-[calc(100vh_-_122px)] overflow-y-scroll">
      <Heading
        title="Working hours"
        description="Effortlessly tailor your working time settings to optimize productivity and work-life balance"
      />

      <Form
        className="flex flex-col gap-4"
        onSubmit={handleSubmit(async (updateSettingsInput) => {
          await updateSettings(updateSettingsInput);
        }, console.error)}
      >
        <Controller
          control={control}
          name="start"
          rules={{
            required: true,
          }}
          render={({ field: { value = 0, onChange } }) => (
            <Select
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
          }}
          render={({ field: { value = 0, onChange } }) => (
            <Select
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

        <Controller
          control={control}
          name="days"
          rules={{
            required: true,
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

        <Button
          size="lg"
          className="px-6 w-fit"
          disabled={!isValid}
          loading={isSubmitting}
        >
          Save
        </Button>
      </Form>
    </Container>
  );
}
