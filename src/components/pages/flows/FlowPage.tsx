import { ReactElement } from "react";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

export function FlowPage() {
  return (
    <div>
      <h1>FlowPage</h1>
    </div>
  );
}

FlowPage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
