import { PropsWithChildren } from "react";
import { Sidebar } from "components/organisms/sidebar";
import { Header } from "components/organisms/header";

export function SidebarLayout({ children }: PropsWithChildren) {
  return (
    <main className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Header />

        <main>{children}</main>
      </div>
    </main>
  );
}
