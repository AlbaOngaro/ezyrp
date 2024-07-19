import { ReactElement, useMemo, useState } from "react";
import {
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
  subDays,
} from "date-fns";

import { api } from "convex/_generated/api";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { StatCard, Stats } from "components/organisms/stat-card";
import { HomeStatsRangePicker } from "components/organisms/home-stats-range-picker";
import { HomeInvoicesCard } from "components/organisms/home-invoices-card";
import { HomeChart } from "components/organisms/home-chart";

import { Container } from "components/atoms/container";
import { Heading } from "components/atoms/heading";
import { Skeleton } from "components/atoms/skeleton";

import { useQuery } from "lib/hooks/useQuery";

export function HomePage() {
  const today = useMemo(
    () =>
      setMilliseconds(setSeconds(setMinutes(setHours(new Date(), 0), 0), 0), 0),
    [],
  );

  const [start, setStart] = useState(subDays(today, 7).getTime());
  const [end, setEnd] = useState(today.getTime());

  const { data, status } = useQuery(api.stats.range, {
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

        <HomeStatsRangePicker
          start={start}
          setStart={setStart}
          end={end}
          setEnd={setEnd}
        />
      </Container>

      <Container as="section">
        <div className="grid grid-cols-12 gap-4">
          {status === "success" ? (
            <>
              {Object.entries(data).map(([key, value]) => (
                <StatCard
                  key={key}
                  type={key as keyof Stats}
                  value={value}
                  className="col-span-4"
                />
              ))}
              <HomeInvoicesCard
                invoices={data.invoices}
                className="col-span-5"
              />
            </>
          ) : (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-28 col-span-4" />
              ))}
              <Skeleton className="col-span-5" />
            </>
          )}

          <HomeChart className="col-span-7" />
        </div>
      </Container>
    </>
  );
}

HomePage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
