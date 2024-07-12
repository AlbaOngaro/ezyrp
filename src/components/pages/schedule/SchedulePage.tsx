import { ReactElement, useMemo } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { CalendarContents } from "./calendar-contents";
import { EventTypesContents } from "./eventTypes-contents";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

export type Props = {
  selected: string | null;
};

export function SchedulePage({ selected }: Props) {
  const nav = useMemo(
    () => [
      {
        value: "calendar",
        label: "Calendar",
        content: (
          <CalendarContents
            selected={selected ? new Date(selected) : new Date()}
          />
        ),
      },
      {
        value: "event-types",
        label: "Event Types",
        content: <EventTypesContents />,
      },
    ],
    [selected],
  );

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
