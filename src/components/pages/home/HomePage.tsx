import { Fragment, ReactElement, useState } from "react";
import { formatISO, subDays } from "date-fns";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { api } from "convex/_generated/api";
import { useQuery } from "lib/hooks/useQuery";
import { StatCard, Stats } from "components/organisms/stat-card";
import { Heading } from "components/atoms/heading";
import { HomeStatsRangePicker } from "components/organisms/home-stats-range-picker";
import { Skeleton } from "components/atoms/skeleton";

export function HomePage() {
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

        <HomeStatsRangePicker
          start={start}
          setStart={setStart}
          end={end}
          setEnd={setEnd}
        />
      </Container>

      <Container as="section">
        <div className="grid grid-cols-4 gap-x-4">
          {status === "success"
            ? Object.entries(data).map(([key, value]) => (
                <StatCard key={key} type={key as keyof Stats} value={value} />
              ))
            : Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
        </div>
      </Container>
    </>
  );
}

HomePage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
