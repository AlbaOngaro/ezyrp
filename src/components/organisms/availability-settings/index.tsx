import { Form } from "@radix-ui/react-form";
import { FormProvider, useForm } from "react-hook-form";
import { forwardRef } from "react";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { DAYS } from "./constants";
import { schema, Settings } from "./schema";
import { Day } from "./Day";
import { Container } from "components/atoms/container";
import { Heading } from "components/atoms/heading";
import { Button } from "components/atoms/button";

import { useMutation } from "lib/hooks/useMutation";
import { useLazyQuery } from "lib/hooks/useLazyQuery";

import { api } from "convex/_generated/api";

export const AvailabilitySettings = forwardRef<HTMLDivElement, unknown>(
  function AvailabilitySettings(_, ref) {
    const [loadSettings] = useLazyQuery(api.settings.get);
    const updateSettings = useMutation(api.settings.upsert);

    const { handleSubmit, formState, ...methods } = useForm<Settings>({
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

    const { isValid, isSubmitting } = formState;

    return (
      <Container
        ref={ref}
        className="grid grid-cols-[1fr_2fr] py-12 gap-x-4 max-w-none h-[calc(100vh_-_122px)] overflow-y-scroll"
      >
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
          <FormProvider
            {...{
              ...methods,
              handleSubmit,
              formState,
            }}
          >
            <div className="flex flex-col gap-4">
              {DAYS.map((day) => (
                <Day key={day.key} day={day} />
              ))}
            </div>
          </FormProvider>
          <Button
            className="px-6 w-fit"
            disabled={!isValid}
            loading={isSubmitting}
          >
            Save
          </Button>
        </Form>
      </Container>
    );
  },
);
