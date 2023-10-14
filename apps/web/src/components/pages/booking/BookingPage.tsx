import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useQuery } from "@apollo/client";
import { ClockIcon } from "@radix-ui/react-icons";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { FormEvent, useMemo } from "react";
import { differenceInDays, format, isAfter, isSameDay } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { Form } from "@radix-ui/react-form";

import { Container } from "components/atoms/container/Container";
import { Card } from "components/atoms/card/Card";
import { MonthWidget } from "components/atoms/month-widget/MonthWidget";
import { BOOKING } from "lib/queries/BOOKING";
import { InputCreateEventArgs } from "__generated__/graphql";
import { Button } from "components/atoms/button/Button";
import { useEvents } from "hooks/useEvents";

type Props = {
  eventtype: string;
};

export function BookingPage({ eventtype }: Props) {
  const today = useMemo(() => new Date(), []);

  const events = useEvents();

  const { data, refetch } = useQuery(BOOKING, {
    variables: {
      id: eventtype,
      day: today.toISOString(),
    },
  });

  const {
    control,
    formState: { isValid, isSubmitting },
    handleSubmit,
  } = useForm<InputCreateEventArgs>({
    defaultValues: {
      type: eventtype,
      start: today.toISOString(),
      guests: [],
      notes: "",
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) =>
    handleSubmit(async (data) => {
      try {
        await events.create({
          variables: {
            createEventsInput: [data],
          },
        });
      } catch (error: unknown) {
        console.error(error);
      }
    })(e);

  return (
    <Container className="flex justify-center items-center h-screen">
      <Form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <Card className="grid grid-cols-[200px_minmax(300px,1fr)_200px] p-0 border border-gray-100">
          <aside className="border-r border-gray-100 p-4">
            <h1 className="text-2xl font-bold">{data?.booking?.name}</h1>
            <span className="flex gap-2 items-center">
              <ClockIcon /> {data?.booking?.duration} minutes
            </span>
          </aside>

          <Controller
            control={control}
            name="start"
            render={({ field: { value, onChange } }) => (
              <>
                <MonthWidget
                  className="py-6 px-4 m-auto w-full max-w-[300px]"
                  date={new Date(value)}
                  onDayClick={(date) => {
                    onChange(date.toISOString());
                    refetch({
                      day: date.toISOString(),
                    });
                  }}
                  withNavigation
                  showSelected={(date) => isSameDay(date, new Date(value))}
                  isDayDisabled={(date) => {
                    const diff = differenceInDays(date, today);

                    if (diff < 0) {
                      return true;
                    }

                    const day = date.getDay() === 0 ? 6 : date.getDay() - 1;

                    return !data?.booking?.days?.includes(day);
                  }}
                  isPrevDisabled={(date) => !isAfter(date, today)}
                />

                <div className="py-6 px-4">
                  <time
                    dateTime={value}
                    className="mb-6 text-sm inline-block font-bold"
                  >
                    {format(new Date(value), "EEEE, MMMM dd")}
                  </time>

                  <RadioGroup.Root
                    className="overflow-y-scroll h-72 flex flex-col gap-2"
                    onValueChange={(slot) => {
                      const [hours, minutes] = slot.split(":").map(Number);
                      const date = new Date(value);
                      date.setHours(hours, minutes);
                      onChange(date.toISOString());
                    }}
                  >
                    {data?.booking?.slots.map((item) => (
                      <RadioGroup.Item
                        value={item}
                        className="text-center font-bold p-2 text-orange-400 border border-orange-400 rounded-sm cursor-pointer data-[state='checked']:bg-orange-50 hover:bg-orange-50 focus:bg-orange-200"
                        key={item}
                      >
                        {item}
                      </RadioGroup.Item>
                    ))}
                  </RadioGroup.Root>
                </div>
              </>
            )}
          />
        </Card>

        <Button
          loading={isSubmitting}
          disabled={!isValid}
          size="lg"
          className="ml-auto px-4"
        >
          Book
        </Button>
      </Form>
    </Container>
  );
}

export async function getServerSideProps({
  query,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  const eventtype = Array.isArray(query.eventtype)
    ? query.eventtype[0]
    : query.eventtype;

  if (!eventtype) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      eventtype,
    },
  };
}
