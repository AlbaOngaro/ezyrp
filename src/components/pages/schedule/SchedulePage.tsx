import { ReactElement } from "react";
import * as Tabs from "@radix-ui/react-tabs";

import { ScheduleContents } from "./ScheduleContents";
import { EventTypesContents } from "./EventTypesContents";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

const nav = [
  {
    value: "event-types",
    label: "Event Types",
    content: <EventTypesContents />,
  },
  {
    value: "schedule",
    label: "Schedule",
    content: <ScheduleContents />,
  },
];

export function SchedulePage() {
  return (
    <Tabs.Root defaultValue={nav[0].value}>
      <Tabs.List
        asChild
        className="flex gap-x-4 overflow-x-auto py-4 px-8 border-b border-gray-200 bg-white"
      >
        <nav>
          {nav.map((item) => (
            <Tabs.Trigger
              key={item.value}
              className="text-muted-foreground hover:text-primary data-[state='active']:text-primary font-medium"
              value={item.value}
            >
              {item.label}
            </Tabs.Trigger>
          ))}
        </nav>
      </Tabs.List>

      {nav.map(({ content, value }) => (
        <Tabs.Content key={value} value={value} asChild>
          {content}
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}

SchedulePage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
