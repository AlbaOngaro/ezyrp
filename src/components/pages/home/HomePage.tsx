import { Fragment, ReactElement, useState } from "react";
import { subDays } from "date-fns";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { api } from "convex/_generated/api";
import { StatCard, Stats } from "components/organisms/stat-card";
import { Heading } from "components/atoms/heading";
import { HomeStatsRangePicker } from "components/organisms/home-stats-range-picker";
import { Skeleton } from "components/atoms/skeleton";
import { HomeInvoicesCard } from "components/organisms/home-invoices-card";
import { useQuery } from "lib/hooks/useQuery";

export function HomePage() {
  const [start, setStart] = useState(subDays(new Date(), 7).getTime());
  const [end, setEnd] = useState(new Date().getTime());

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
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 col-span-4" />
            ))
          )}
        </div>
      </Container>
    </>
  );
}

HomePage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
