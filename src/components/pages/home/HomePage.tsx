import { ReactElement, useState } from "react";

import { useQuery } from "@apollo/client";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { twMerge } from "lib/utils/twMerge";
import { useCustomers } from "hooks/useCustomers";
import { Customer } from "__generated__/graphql";
import { STATS } from "lib/queries/STATS";

const secondaryNavigation = [
  { name: "Last 7 days", value: 7 },
  { name: "Last 30 days", value: 30 },
  { name: "All-time", value: -1 },
];

const CHF = new Intl.NumberFormat("en-US", {
  currency: "CHF",
  style: "currency",
});

export function HomePage() {
  const customers = useCustomers();

  const { data, loading, refetch } = useQuery(STATS, {
    variables: {
      filters: {
        period: 7,
      },
    },
  });

  const [timeSpan, setTimeSpan] = useState<number>(7);

  return (
    <main>
      {/* Secondary navigation */}
      <header className="pb-4 pt-6 sm:pb-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-6 px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <h1 className="text-base font-semibold leading-7 text-gray-900">
            Cashflow
          </h1>
          <div className="order-last flex w-full gap-x-8 text-sm font-semibold leading-6 sm:order-none sm:w-auto sm:border-l sm:border-gray-200 sm:pl-6 sm:leading-7">
            {secondaryNavigation.map((item) => (
              <button
                key={item.name}
                className={twMerge("text-gray-700", {
                  "text-indigo-600": item.value === timeSpan,
                })}
                onClick={() => {
                  setTimeSpan(item.value);
                  refetch({
                    filters: {
                      period: item.value,
                    },
                  });
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Stats */}
      {!loading && data?.stats && (
        <div className="border-b border-b-gray-900/10 lg:border-t lg:border-t-gray-900/5">
          <dl className="mx-auto grid max-w-7xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:px-2 xl:px-0">
            {Object.values(data.stats).map((stat, statIdx) => {
              if (typeof stat === "string") {
                return null;
              }

              return (
                <div
                  key={statIdx}
                  className={twMerge(
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
                    className={twMerge("text-gray-700 text-xs font-medium", {
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
          </dl>
        </div>
      )}

      {/* Recent client list*/}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Recent clients
            </h2>
            <a
              href="#"
              className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              View all<span className="sr-only">, clients</span>
            </a>
          </div>
          <ul
            role="list"
            className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8"
          >
            {((customers?.data?.customers || []) as Customer[]).map(
              (customer) => (
                <li
                  key={customer.id}
                  className="overflow-hidden rounded-xl border border-gray-200"
                >
                  <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                    {/* <img
                    src={client.imageUrl}
                    alt={customer.name}
                    className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
                  /> */}
                    <div className="text-sm font-medium leading-6 text-gray-900">
                      {customer.name}
                    </div>
                  </div>

                  {/* <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Last invoice</dt>
                    <dd className="text-gray-700">
                      <time dateTime={client.lastInvoice.dateTime}>
                        {client.lastInvoice.date}
                      </time>
                    </dd>
                  </div>
                  <div className="flex justify-between gap-x-4 py-3">
                    <dt className="text-gray-500">Amount</dt>
                    <dd className="flex items-start gap-x-2">
                      <div className="font-medium text-gray-900">
                        {client.lastInvoice.amount}
                      </div>
                      <div
                        className={twMerge(
                          "rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset",
                        )}
                      >
                        {client.lastInvoice.status}
                      </div>
                    </dd>
                  </div>
                </dl> */}
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    </main>
  );
}

HomePage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
