import { ReactElement } from "react";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

export function InvoicePage() {
  return <h1>Invoice</h1>;
}

InvoicePage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout isSidebarOpen={false}>{page}</SidebarLayout>;
};
