import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useQuery } from "@apollo/client";
import { ClockIcon } from "@radix-ui/react-icons";
import { useMemo, useState } from "react";
import { differenceInDays, format, isAfter, isSameDay } from "date-fns";

import { Container } from "components/atoms/container/Container";
import { Card } from "components/atoms/card/Card";
import { MonthWidget } from "components/atoms/month-widget/MonthWidget";
import { BOOKING } from "lib/queries/BOOKING";

type Props = {
  eventtype: string;
};

export function BookingPage({ eventtype }: Props) {
  const { data } = useQuery(BOOKING, {
    variables: {
      id: eventtype,
    },
  });

  const today = useMemo(() => new Date(), []);

  const [selected, setSelected] = useState(new Date());

  const schedule = useMemo(() => {
    const start = data?.booking?.settings?.start || 0;
    const end = data?.booking?.settings?.end || 0;
    const duration = data?.booking?.event?.duration || 0;
    const minutes = 60 / duration;

    const length = (end - start) * minutes;

    return Array.from(
      {
        length,
      },
      (_, i) => {
        const date = new Date();
        date.setHours(start, duration * i);
        return format(date, "HH:mm");
      },
    );
  }, [data]);

  return (
    <Container className="flex justify-center items-center h-screen">
      <Card className="grid grid-cols-[200px_minmax(300px,1fr)_200px] p-0 border border-gray-100">
        <aside className="border-r border-gray-100 p-4">
          <h1 className="text-2xl font-bold">{data?.booking?.event?.name}</h1>
          <span className="flex gap-2 items-center">
            <ClockIcon /> {data?.booking?.event?.duration} minutes
          </span>
        </aside>

        <MonthWidget
          className="py-6 px-4"
          date={selected}
          onDayClick={setSelected}
          withNavigation
          showSelected={(date) => isSameDay(date, selected)}
          isDayDisabled={(date) => differenceInDays(date, today) < 0}
          isPrevDisabled={(date) => !isAfter(date, today)}
        />

        <div className="py-6 px-4">
          <time
            dateTime={selected.toISOString()}
            className="mb-6 text-sm inline-block font-bold"
          >
            {format(selected, "EEEE, MMMM dd")}
          </time>

          <ol className="overflow-y-scroll h-72 flex flex-col gap-2">
            {schedule.map((item) => (
              <li
                className="text-center font-bold p-2 text-orange-400 border border-orange-400 rounded-sm cursor-pointer hover:bg-orange-50"
                key={item}
              >
                {item}
              </li>
            ))}
          </ol>
        </div>
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
