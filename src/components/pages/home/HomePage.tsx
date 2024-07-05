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
      {/* Secondary navigation */}
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
                  "text-orange-500": item.value === timeSpan,
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

      {/* Stats */}
      {/* {stats?.stats && (
        <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
          <Container
            as="dl"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:px-2 xl:px-0"
          >
            {Object.values(stats.stats).map((stat, statIdx) => {
              if (typeof stat === "string") {
                return null;
              }

              return (
                <div
                  key={statIdx}
                  className={cn(
                    {
                      "sm:border-l": statIdx % 2 === 1,
                      "lg:border-l": statIdx === 2,
                    },
                    "flex items-baseline flex-wrap justify-between gap-y-2 gap-x-4 border-t border-gray-900/5 px-4 py-10 sm:px-6 lg:border-t-0 xl:px-8",
                  )}
                >
                  <dt className="text-sm font-medium leading-6 text-gray-500">
                    {stat.name}
                  </dt>
                  <dd
                    className={cn("text-gray-700 text-xs font-medium", {
                      "text-rose-600": stat.change < 0,
                    })}
                  >
                    {stat.change.toFixed(1)}%
                  </dd>
                  <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
                    {CHF.format(stat.value / 100)}
                  </dd>
                </div>
              );
            })}
          </Container>
        </div>
      )} */}

      {/* Recent client list*/}
      {/* <Container as="section">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Recent customers
          </h2>
          <Link
            href="/customers"
            className="text-sm font-semibold leading-6 text-orange-500 hover:text-orange-400"
          >
            View all<span className="sr-only">, customers</span>
          </Link>
        </div>
        {customers?.customers && (
          <ul
            role="list"
            className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
          >
            {customers.customers.results.map((customer) => {
              if (!customer.lastInvoice) {
                return null;
              }

              return (
                <Card
                  as="li"
                  key={customer.id}
                  className="overflow-hidden rounded-xl border border-gray-200 p-0"
                >
                  <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                    <Avatar
                      photoUrl={customer.photoUrl}
                      seed={customer.email}
                    />
                    <div className="text-sm font-medium leading-6 text-gray-900">
                      {customer.name}
                    </div>
                  </div>

                  <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-gray-500">Last invoice</dt>
                      <dd className="text-gray-700">
                        <time dateTime={customer.lastInvoice.emitted}>
                          {format(
                            new Date(customer.lastInvoice.emitted),
                            "MMMM do, yyyy",
                          )}
                        </time>
                      </dd>
                    </div>
                    <div className="flex justify-between gap-x-4 py-3">
                      <dt className="text-gray-500">Amount</dt>
                      <dd className="flex items-center gap-x-2">
                        <div className="font-medium text-gray-900">
                          {CHF.format(customer.lastInvoice.amount / 100)}
                        </div>
                        <Badge
                          size="sm"
                          variant={(() => {
                            switch (customer.lastInvoice.status) {
                              case "overdue":
                                return "danger";
                              case "paid":
                                return "success";
                              case "pending":
                              default:
                                return "info";
                            }
                          })()}
                        >
                          {customer.lastInvoice.status}
                        </Badge>
                      </dd>
                    </div>
                  </dl>
                </Card>
              );
            })}
          </ul>
        )}
      </Container> */}
    </>
  );
}

HomePage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
