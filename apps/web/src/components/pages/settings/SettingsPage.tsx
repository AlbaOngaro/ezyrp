import { ReactElement } from "react";
import * as Tabs from "@radix-ui/react-tabs";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { AccountSettings } from "components/organisms/account-settings/AccountSettings";
import { TeamSettings } from "components/organisms/team-settings/TeamSettings";

const nav = [
  {
    value: "account",
    label: "Account",
    content: <AccountSettings />,
  },
  {
    value: "team",
    label: "Team",
    content: <TeamSettings />,
  },
  {
    value: "billing",
    label: "Billing",
  },
];

export function SettingsPage() {
  return (
    <Tabs.Root defaultValue="account">
      <Tabs.List
        asChild
        className="flex gap-x-4 overflow-x-auto py-4 px-8 border-b border-gray-200 bg-white"
      >
        <nav>
          {nav.map((item) => (
            <Tabs.Trigger
              key={item.value}
              className="data-[state='active']:text-orange-400 font-medium"
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

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
