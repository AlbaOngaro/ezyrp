import { ReactElement, useState } from "react";
import {
  addMonths,
  formatISO,
  isSameMonth,
  isSameYear,
  parseISO,
  subDays,
  subMonths,
} from "date-fns";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { api } from "convex/_generated/api";
import { useQuery } from "lib/hooks/useQuery";
import { Loader } from "components/atoms/loader";
import { StatCard, Stats } from "components/organisms/stat-card";
import { Heading } from "components/atoms/heading";
import { DateRangePicker } from "components/organisms/date-range-picker";
import { cn } from "lib/utils/cn";

// note: export for testing
export function getCanGoToNextMonth(date: Date) {
  const today = new Date();

  return (
    isSameMonth(today, addMonths(date, 1)) &&
    isSameYear(today, addMonths(date, 1))
  );
}

export function HomePage() {
  const [isNextDisabled, setIsNextDisabled] = useState(true);

  const [start, setStart] = useState(
    formatISO(subDays(new Date(), 7), {
      representation: "date",
    }),
  );
  const [end, setEnd] = useState(
    formatISO(new Date(), {
      representation: "date",
    }),
  );

  const { data, status } = useQuery(api.stats.get, {
    range: {
      start,
      end,
    },
  });

  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading
          testId="home__heading"
          title="Dashboard"
          description="An overview of your team"
        />

        <DateRangePicker
          defaultMonth={subMonths(parseISO(start), 1)}
          range={{
            from: parseISO(start),
            to: parseISO(end),
          }}
          onChange={(range) => {
            const from = range?.from;
            const to = range?.to;

            if (!!from) {
              setStart(formatISO(from, { representation: "date" }));
            }

            if (!!to) {
              setEnd(formatISO(to, { representation: "date" }));
            }
          }}
          classNames={{
            nav_button_next: cn("absolute right-1", {
              "pointer-events-none": isNextDisabled,
            }),
          }}
          onMonthChange={(month) => {
            setIsNextDisabled(getCanGoToNextMonth(month));
          }}
        />
      </Container>

      <Container as="section">
        {status === "success" ? (
          <div className="grid grid-cols-4 gap-x-4">
            {Object.entries(data).map(([key, value]) => (
              <StatCard key={key} type={key as keyof Stats} value={value} />
            ))}
          </div>
        ) : (
          <Loader />
        )}
      </Container>
    </>
  );
}

HomePage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
