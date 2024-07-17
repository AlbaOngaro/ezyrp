import { ReactElement } from "react";
import { formatISO, subDays } from "date-fns";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { Container } from "components/atoms/container";
import { Card } from "components/atoms/card";
import { api } from "convex/_generated/api";
import { useQuery } from "lib/hooks/useQuery";
import { Loader } from "components/atoms/loader";
import { StatCard, Stats } from "components/organisms/stat-card";
import { Heading } from "components/atoms/heading";

export function HomePage() {
  const start = formatISO(subDays(new Date(), 7), {
    representation: "date",
  });
  const end = formatISO(new Date(), {
    representation: "date",
  });

  const { data, status } = useQuery(api.stats.get, {
    range: {
      start,
      end,
    },
  });

  if (status === "pending") {
    return (
      <Container as="section">
        <Loader />
      </Container>
    );
  }

  if (status === "error") {
    return (
      <Container as="section">
        <Card>
          <p>Failed to load data</p>
        </Card>
      </Container>
    );
  }

  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading title="Dashboard" description="An overview of your team" />
      </Container>

      <Container as="section">
        <div className="grid grid-cols-4 gap-x-4">
          {Object.entries(data).map(([key, value]) => (
            <StatCard key={key} type={key as keyof Stats} value={value} />
          ))}
        </div>
      </Container>
    </>
  );
}

HomePage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
