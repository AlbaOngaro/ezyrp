import { PropsWithChildren } from "react";

import { Sidebar } from "../../organisms/sidebar/Sidebar";
import { Header } from "../../organisms/header/Header";

interface Props extends PropsWithChildren {
  isSidebarOpen?: boolean;
}

export function SidebarLayout({ children, isSidebarOpen }: Props) {
  return (
    <main className="h-full grid grid-cols-[min-content_1fr] bg-gray-50 print:grid-cols-1">
      <Sidebar isOpen={isSidebarOpen} />

      <section>
        <Header />

        {children}
      </section>
    </main>
  );
}
