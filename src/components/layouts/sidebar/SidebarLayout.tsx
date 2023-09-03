import { PropsWithChildren } from "react";
import { BellIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import * as Menu from "@radix-ui/react-navigation-menu";

import { Sidebar } from "components/organisms/sidebar/Sidebar";
import { useUser } from "hooks/useUser";
import { twMerge } from "lib/utils/twMerge";

const userNavigation = [
  { name: "Your profile", href: "/profile" },
  {
    name: "Sign out",
    href: "/api/auth/logout?redirect_to=http://localhost:3000/login",
  },
];

export function SidebarLayout({ children }: PropsWithChildren) {
  const { data } = useUser();

  return (
    <main className="h-full grid grid-cols-[300px_1fr]">
      <Sidebar />

      <section>
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-end gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            <Menu.Root>
              <Menu.List>
                <Menu.Item>
                  <Menu.Trigger className="-m-1.5 flex items-center p-1.5">
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-8 w-8 rounded-full bg-gray-50"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                    <span className="hidden lg:flex lg:items-center">
                      <span
                        className="ml-4 text-sm font-semibold leading-6 text-gray-900"
                        aria-hidden="true"
                      >
                        {data?.user?.profile?.name ||
                          data?.user?.username ||
                          ""}
                      </span>
                      <ChevronDownIcon
                        className="ml-2 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Menu.Trigger>
                  <Menu.Content className="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    {userNavigation.map((item) => (
                      <Menu.Link asChild key={item.name}>
                        <a
                          href={item.href}
                          className={twMerge(
                            "block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-slate-50",
                          )}
                        >
                          {item.name}
                        </a>
                      </Menu.Link>
                    ))}
                  </Menu.Content>
                </Menu.Item>
              </Menu.List>
            </Menu.Root>
          </div>
        </header>

        {children}
      </section>
    </main>
  );
}
