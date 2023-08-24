import { ReactElement } from "react";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Calendar } from "components/organisms/calendar/Calendar";

export function SchedulePage() {
  return <Calendar className="p-12 lg:h-5/6" />;
}

SchedulePage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
