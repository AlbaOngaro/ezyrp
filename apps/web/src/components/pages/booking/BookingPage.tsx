import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { FormEvent, useMemo, useState } from "react";
import {
  addHours,
  differenceInDays,
  format,
  isAfter,
  isSameDay,
  subHours,
  subMonths,
} from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { Form } from "@radix-ui/react-form";

import { Container } from "components/atoms/container/Container";
import { Card } from "components/atoms/card/Card";
import { MonthWidget } from "components/atoms/month-widget/MonthWidget";
import { BOOKING } from "lib/queries/BOOKING";
import { Button } from "components/atoms/button/Button";
import { Input } from "components/atoms/input/Input";
import { TextArea } from "components/atoms/textarea/TextArea";
import { BOOK_EVENT } from "lib/mutations/BOOK_EVENT";
import { BookEventInput } from "__generated__/graphql";
import { EVENTS } from "lib/queries/EVENTS";

type Props = {
  eventtype: string;
};

enum View {
  Time,
  Details,
}

export function BookingPage({ eventtype }: Props) {
  const today = useMemo(() => new Date(), []);

  const [view, setView] = useState(View.Time);

  const [loadBooking, { data, loading, error, refetch }] =
    useLazyQuery(BOOKING);
  const [bookEvent] = useMutation(BOOK_EVENT, {
    refetchQueries: [EVENTS],
  });

  const {
    control,
    handleSubmit,
    watch,
    register,
    formState: { isLoading, isSubmitting, isValid },
  } = useForm<BookEventInput>({
    defaultValues: async () => {
      const { data } = await loadBooking({
        variables: {
          id: eventtype,
        },
      });

      return {
        type: eventtype,
        start: data?.booking?.day as string,
        guests: [],
        notes: "",
      };
    },
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) =>
    handleSubmit(async (bookEventInput) => {
      try {
        await bookEvent({
          variables: {
            bookEventInput,
          },
        });
      } catch (error: unknown) {
        console.error(error);
      }
    })(e);

  if (loading || isLoading) {
    return null;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <Container className="flex justify-center items-center h-screen overflow-hidden pt-12 pb-16">
      <Card className="grid grid-cols-12 gap-4 w-full max-w-3xl p-0 border border-gray-100">
        <aside className="col-span-3 border-r border-gray-100 p-4 pr-0">
          <h1 className="text-2xl font-bold">{data?.booking?.name}</h1>
          <span className="flex gap-2 items-center">
            <ClockIcon /> {data?.booking?.duration} minutes
          </span>
          {view === View.Details && (
            <span className="flex gap-2 items-center">
              <CalendarIcon className="shrink-0 self-start" />{" "}
              {format(new Date(watch("start")), "HH:mm, EEEE, MMMM dd yyyy")}
            </span>
          )}
        </aside>

        <Form
          className="col-span-9 p-4 pl-0 grid grid-cols-12 gap-y-4 relative"
          onSubmit={onSubmit}
        >
          {(() => {
            switch (view) {
              case View.Time:
                return (
                  <Controller
                    control={control}
                    name="start"
                    render={({ field: { value, onChange } }) => (
                      <>
                        <h3 className="text-lg font-bold col-span-6 self-end">
                          Select a Date & Time
                        </h3>

                        <time
                          dateTime={value}
                          className="text-sm inline-block font-bold self-end col-start-8 col-end-13"
                        >
                          {format(new Date(value), "EEEE, MMMM dd")}
                        </time>

                        <MonthWidget
                          className="col-span-6"
                          date={new Date(value)}
                          onDayClick={(date) => {
                            const diff = new Date().getTimezoneOffset() / 60;

                            const day =
                              diff > 0
                                ? addHours(date, diff)
                                : subHours(date, diff);

                            onChange(day.toISOString());
                            refetch({
                              day: day.toISOString(),
                            });
                          }}
                          withNavigation
                          showSelected={(date) =>
                            isSameDay(date, new Date(value))
                          }
                          isDayDisabled={(date) => {
                            const diff = differenceInDays(date, today);

                            if (diff < 0) {
                              return true;
                            }

                            const day =
                              date.getDay() === 0 ? 6 : date.getDay() - 1;

                            return !data?.booking?.days?.includes(day);
                          }}
                          isPrevDisabled={(date) =>
                            !isAfter(subMonths(date, 1), today)
                          }
                        />

                        <div className="absolute row-start-2 col-start-8 col-end-13 h-full w-full overflow-y-auto">
                          <RadioGroup.Root
                            asChild
                            className="flex flex-col gap-2 "
                            onValueChange={(slot) => {
                              const [hours, minutes] = slot
                                .split(":")
                                .map(Number);
                              const date = new Date(value);
                              date.setHours(hours, minutes);
                              onChange(date.toISOString());
                            }}
                          >
                            <ol>
                              {data?.booking?.slots.map((slot) => {
                                const [hours, minutes] = slot
                                  .split(":")
                                  .map(Number);

                                const item = `${(
                                  hours -
                                  new Date().getTimezoneOffset() / 60
                                )
                                  .toString()
                                  .padStart(2, "0")}:${minutes
                                  .toString()
                                  .padEnd(2, "0")}`;

                                return (
                                  <li
                                    key={slot}
                                    className="grid grid-cols-2 gap-2 items-center"
                                  >
                                    <RadioGroup.Item
                                      value={slot}
                                      className="w-full text-center font-bold p-2 text-orange-400 border border-orange-400 rounded-sm cursor-pointer hover:bg-orange-50 focus:bg-orange-200 col-span-2  [&[data-state='checked']]:col-span-1 [&[data-state='checked']]:bg-orange-50 [&[data-state='checked']~button]:flex"
                                    >
                                      {item}
                                    </RadioGroup.Item>
                                    <Button
                                      className="hidden items-center justify-center w-full h-full"
                                      onClick={() => setView(View.Details)}
                                    >
                                      Next
                                    </Button>
                                  </li>
                                );
                              })}
                            </ol>
                          </RadioGroup.Root>
                        </div>
                      </>
                    )}
                  />
                );
              case View.Details:
                return (
                  <div className="col-span-8 flex flex-col gap-4">
                    <Input
                      label="Name"
                      {...register("guests.0.name", { required: true })}
                    />
                    <Input
                      label="Email"
                      type="email"
                      {...register("guests.0.email", { required: true })}
                    />
                    <TextArea label="Notes" {...register("notes")} />

                    <footer className="flex flex-row gap-2">
                      <Button
                        variant="secondary"
                        onClick={() => setView(View.Time)}
                      >
                        Back
                      </Button>
                      <Button disabled={!isValid} loading={isSubmitting}>
                        Schedule
                      </Button>
                    </footer>
                  </div>
                );
            }
          })()}
        </Form>
      </Card>
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
