import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons";
import { FormEvent, createContext, useContext, useMemo, useState } from "react";
import { addMinutes, format, formatISO } from "date-fns";
import { FormProvider, useForm } from "react-hook-form";
import { Form } from "@radix-ui/react-form";

import { useMutation } from "lib/hooks/useMutation";
import { cn } from "lib/utils/cn";
import { Container } from "components/atoms/container";
import { Card } from "components/atoms/card";
import { TimeView } from "components/pages/booking/views/TimeView";
import { DetailsView } from "components/pages/booking/views/DetailsView";
import { SuccessView } from "components/pages/booking/views/SuccessView";
import {
  BookingContextValue,
  Props,
  View,
} from "components/pages/booking/types";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useLazyQuery } from "lib/hooks/useLazyQuery";
import { useQuery } from "lib/hooks/useQuery";

const BookingContext = createContext<BookingContextValue>({
  view: View.Time,
  setView: () => undefined,
  today: new Date(),
});

export function useBookingContext() {
  return useContext(BookingContext);
}

type BookEventFn = typeof api.bookings.create;

export function BookingPage({ eventtype }: Props) {
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState(View.Time);

  const [bookEvent] = useMutation(api.bookings.create);
  const [loadEventType, { data, loading }] = useLazyQuery(api.bookings.get);

  const { handleSubmit, ...methods } = useForm<BookEventFn["_args"]>({
    defaultValues: async () => {
      const data = await loadEventType({
        id: eventtype,
      });

      if (!data) {
        throw new Error("Event type not found");
      }

      return {
        type: eventtype,
        start: formatISO(today),
        end: formatISO(addMinutes(today, data.duration)),
        guests: [],
        notes: "",
      };
    },
  });

  const start = methods.watch("start");

  const day = useMemo(() => {
    if (!start) {
      return;
    }

    return new Date(start).getTime();
  }, [start]);

  const { data: slots = [], status } = useQuery(
    api.bookings.slots,
    day ? { id: eventtype, day } : "skip",
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) =>
    handleSubmit(async (bookEventInput) => {
      try {
        await bookEvent(bookEventInput);
        setView(View.Success);
      } catch (error: unknown) {
        console.error(error);
      }
    })(e);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <BookingContext.Provider value={{ today, view, setView }}>
      <Container className="flex justify-center items-center h-screen overflow-hidden pt-12 pb-16">
        <Card className="grid grid-cols-12 gap-4 w-full max-w-3xl p-0 border border-gray-100">
          {view !== View.Success && (
            <aside className="col-span-3 border-r border-gray-100 p-4 pr-0">
              <h1 className="text-2xl font-bold">{data?.name}</h1>
              <span className="flex gap-2 items-center">
                <ClockIcon /> {data?.duration} minutes
              </span>
              {view === View.Details && (
                <span className="flex gap-2 items-center">
                  <CalendarIcon className="shrink-0 self-start" />{" "}
                  {format(
                    new Date(methods.watch("start")),
                    "HH:mm, EEEE, MMMM dd yyyy",
                  )}
                </span>
              )}
            </aside>
          )}

          <Form
            className={cn(
              "col-span-9 p-4 pl-0 grid grid-cols-12 gap-y-4 relative",
              {
                "col-span-12": view === View.Success,
              },
            )}
            onSubmit={onSubmit}
          >
            <FormProvider {...methods} handleSubmit={handleSubmit}>
              {(() => {
                switch (view) {
                  case View.Time:
                    return (
                      <TimeView
                        loading={status === "pending"}
                        slots={slots}
                        eventType={data}
                      />
                    );
                  case View.Details:
                    return <DetailsView />;
                  case View.Success:
                    return <SuccessView />;
                  default:
                    return null;
                }
              })()}
            </FormProvider>
          </Form>
        </Card>
      </Container>
    </BookingContext.Provider>
  );
}

export async function getServerSideProps({
  query,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  const eventtype = (
    Array.isArray(query.eventtype) ? query.eventtype[0] : query.eventtype
  ) as Id<"eventTypes">;

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
