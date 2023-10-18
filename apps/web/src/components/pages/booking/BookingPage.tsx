import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useLazyQuery, useMutation } from "@apollo/client";
import { CalendarIcon, ClockIcon } from "@radix-ui/react-icons";
import { FormEvent, createContext, useContext, useMemo, useState } from "react";
import { format } from "date-fns";
import { FormProvider, useForm } from "react-hook-form";
import { Form } from "@radix-ui/react-form";

import { Container } from "components/atoms/container/Container";
import { Card } from "components/atoms/card/Card";
import { BOOKING } from "lib/queries/BOOKING";
import { BOOK_EVENT } from "lib/mutations/BOOK_EVENT";
import { BookEventInput } from "__generated__/graphql";
import { EVENTS } from "lib/queries/EVENTS";
import { twMerge } from "lib/utils/twMerge";
import { TimeView } from "components/pages/booking/views/TimeView";
import { DetailsView } from "components/pages/booking/views/DetailsView";
import { SuccessView } from "components/pages/booking/views/SuccessView";
import {
  BookingContextValue,
  Props,
  View,
} from "components/pages/booking/types";

const BookingContext = createContext<BookingContextValue>({
  view: View.Time,
  setView: () => {},
  today: new Date(),
});

export function useBookingContext() {
  return useContext(BookingContext);
}

export function BookingPage({ eventtype }: Props) {
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState(View.Time);

  const [loadBooking, { data, loading, error }] = useLazyQuery(BOOKING);
  const [bookEvent] = useMutation(BOOK_EVENT, {
    refetchQueries: [EVENTS],
  });

  const { handleSubmit, ...methods } = useForm<BookEventInput>({
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

        setView(View.Success);
      } catch (error: unknown) {
        console.error(error);
      }
    })(e);

  if (loading || methods.formState.isLoading) {
    return null;
  }

  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <BookingContext.Provider value={{ today, view, setView }}>
      <Container className="flex justify-center items-center h-screen overflow-hidden pt-12 pb-16">
        <Card className="grid grid-cols-12 gap-4 w-full max-w-3xl p-0 border border-gray-100">
          {view !== View.Success && (
            <aside className="col-span-3 border-r border-gray-100 p-4 pr-0">
              <h1 className="text-2xl font-bold">{data?.booking?.name}</h1>
              <span className="flex gap-2 items-center">
                <ClockIcon /> {data?.booking?.duration} minutes
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
            className={twMerge(
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
                    return <TimeView />;
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
