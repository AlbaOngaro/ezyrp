import { ReactElement, useState } from "react";

import { Container } from "components/atoms/container";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { cn } from "lib/utils/cn";

const secondaryNavigation = [
  { name: "Last 7 days", value: 7 },
  { name: "Last 30 days", value: 30 },
  { name: "All-time", value: -1 },
];

export function HomePage() {
  const [timeSpan, setTimeSpan] = useState<number>(7);

  return (
    <>
      <header className="pb-4 pt-6 bg-white sm:pb-6" data-testid="home__header">
        <Container className="flex flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Cashflow
          </h1>
          <div className="order-last flex w-full gap-x-8 text-sm font-semibold leading-6 sm:order-none sm:w-auto sm:border-l sm:border-gray-200 sm:pl-6 sm:leading-7">
            {secondaryNavigation.map((item) => (
              <button
                key={item.name}
                className={cn("text-gray-700", {
                  "text-black": item.value === timeSpan,
                })}
                onClick={() => {
                  setTimeSpan(item.value);
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        </Container>
      </header>
    </>
  );
}

HomePage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
