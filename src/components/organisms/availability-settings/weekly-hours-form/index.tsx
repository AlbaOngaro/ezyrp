import { useFormContext } from "react-hook-form";
import { Form } from "@radix-ui/react-form";
import { useMutation } from "convex/react";
import { DAYS } from "../constants";
import { Settings } from "../schema";
import { Day } from "./day";
import { Heading } from "components/atoms/heading";
import { Button } from "components/atoms/button";
import { api } from "convex/_generated/api";

export function WeeklyHoursForm() {
  const {
    handleSubmit,
    formState: { isDirty, isValid, isSubmitting },
  } = useFormContext<Settings>();

  const updateSettings = useMutation(api.settings.upsert);

  return (
    <Form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(async (updateSettingsInput) => {
        await updateSettings(updateSettingsInput);
      }, console.error)}
    >
      <Heading
        className="h-fit sm:flex-none mb-6"
        title="Weekly hours"
        description="Effortlessly tailor your working time settings to optimize productivity and work-life balance"
      />

      <div className="flex flex-col gap-4">
        {DAYS.map((day) => (
          <Day key={day.key} day={day} />
        ))}
      </div>
      <Button
        className="px-6 w-fit"
        disabled={!isDirty || !isValid}
        loading={isSubmitting}
      >
        Save
      </Button>
    </Form>
  );
}
