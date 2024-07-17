import { ReactElement, useState } from "react";
import { formatISO, parseISO, subDays } from "date-fns";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { api } from "convex/_generated/api";
import { useQuery } from "lib/hooks/useQuery";
import { Loader } from "components/atoms/loader";
import { StatCard, Stats } from "components/organisms/stat-card";
import { Heading } from "components/atoms/heading";
import { DateRangePicker } from "components/organisms/date-range-picker";

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
        <Heading title="Dashboard" description="An overview of your team" />

        <DateRangePicker
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
