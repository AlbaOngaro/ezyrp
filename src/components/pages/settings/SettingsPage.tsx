import { ReactElement, useMemo } from "react";
import * as Tabs from "@radix-ui/react-tabs";

import { AvailabilitySettings } from "components/organisms/availability-settings";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { TeamSettings } from "components/organisms/team-settings";
import { BillingSettings } from "components/organisms/billing-settings";

import { useHash } from "hooks/useHash";
import { useGetIsAdmin } from "lib/hooks/useGetIsAdmin";

export function SettingsPage() {
  const active = useHash();
  const isAdmin = useGetIsAdmin();

  const nav = useMemo(() => {
    if (isAdmin) {
      return [
        {
          value: "#availability",
          label: "Availability",
          content: <AvailabilitySettings />,
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
        value: "#availability",
        label: "Availability",
        content: <AvailabilitySettings />,
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
              data-testid="settings-page__tab"
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
