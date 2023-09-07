import { PropsWithChildren } from "react";

import { Sidebar } from "components/organisms/sidebar/Sidebar";
import { Header } from "components/organisms/header/Header";

interface Props extends PropsWithChildren {
  isSidebarOpen?: boolean;
}

export function SidebarLayout({ children, isSidebarOpen }: Props) {
  return (
    <main className="h-full grid grid-cols-[min-content_1fr]">
      <Sidebar isOpen={isSidebarOpen} />

      <section>
        <Header />

        {children}
      </section>
    </main>
  );
}
