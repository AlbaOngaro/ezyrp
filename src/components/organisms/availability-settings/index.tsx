import { FormProvider, useForm } from "react-hook-form";
import { forwardRef } from "react";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { schema, Settings } from "./schema";
import { WeeklyHoursForm } from "./weekly-hours-form";
import { VacationsForm } from "./vacations-form";
import { Container } from "components/atoms/container";

import { useLazyQuery } from "lib/hooks/useLazyQuery";

import { api } from "convex/_generated/api";

export const AvailabilitySettings = forwardRef<HTMLDivElement, unknown>(
  function AvailabilitySettings(_, ref) {
    const [loadSettings] = useLazyQuery(api.settings.get);

    const methods = useForm<Settings>({
      defaultValues: async () => {
        const settings = await loadSettings();

        if (!settings) {
          return {
            days: {
              monday: undefined,
              tuesday: undefined,
              wednesday: undefined,
              thursday: undefined,
              friday: undefined,
              saturday: undefined,
              sunday: undefined,
            },
          };
        }

        return {
          days: settings?.days || {
            monday: undefined,
            tuesday: undefined,
            wednesday: undefined,
            thursday: undefined,
            friday: undefined,
            saturday: undefined,
            sunday: undefined,
          },
        };
      },
      resolver: zodResolver(schema),
      mode: "all",
    });

    return (
      <Container
        ref={ref}
        className="grid grid-cols-2 py-12 gap-x-4 max-w-none h-[calc(100vh_-_122px)] overflow-y-scroll"
      >
        <FormProvider {...methods}>
          <WeeklyHoursForm />
        </FormProvider>

        <VacationsForm />
      </Container>
    );
  },
);
