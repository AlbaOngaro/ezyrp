import { ReactElement, useMemo } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { useAuth } from "@clerk/clerk-react";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { TeamSettings } from "components/organisms/team-settings";
import { BillingSettings } from "components/organisms/billing-settings/BillingSettings";
import { ScheduleSettings } from "components/organisms/schedule-settings/ScheduleSettings";
import { useHash } from "hooks/useHash";

export function SettingsPage() {
  const active = useHash();
  const { has } = useAuth();
  const isAdmin = has && has({ role: "org:admin" });

  const nav = useMemo(() => {
    if (isAdmin) {
      return [
        {
          value: "#schedule",
          label: "Schedule",
          content: <ScheduleSettings />,
        },
        {
          value: "#team",
          label: "Team",
          content: <TeamSettings />,
        },
        {
          value: "#billing",
          label: "Billing",
          content: <BillingSettings />,
        },
      ];
    }

    return [
      {
        value: "#schedule",
        label: "Schedule",
        content: <ScheduleSettings />,
      },
    ];
  }, [isAdmin]);

  return (
    <Tabs.Root defaultValue={active || nav[0].value}>
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
              onClick={() => {
                window.location.hash = item.value;
              }}
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

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
