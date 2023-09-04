import { PropsWithChildren } from "react";
import { BellIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import * as Menu from "@radix-ui/react-navigation-menu";
import { createAvatar } from "@dicebear/core";
import { initials } from "@dicebear/collection";
import Link from "next/link";

import { twMerge } from "lib/utils/twMerge";

import { useUser } from "hooks/useUser";

import { Sidebar } from "components/organisms/sidebar/Sidebar";

export function SidebarLayout({ children }: PropsWithChildren) {
  const { data, isLoading, logout } = useUser();

  if (isLoading || !data) {
    return null;
  }

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
                    <picture className="relative h-8 w-8 rounded-full overflow-hidden">
                      <img
                        className="absolute inset-0 h-full w-full object-cover object-center"
                        src={
                          data?.user?.profile?.photoUrl ||
                          createAvatar(initials, {
                            seed: data?.user?.email,
                            scale: 75,
                          }).toDataUriSync()
                        }
                        alt=""
                      />
                    </picture>
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
                    <Menu.Link asChild>
                      <Link
                        href="/profile"
                        className={twMerge(
                          "block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-slate-50",
                        )}
                      >
                        Your profile
                      </Link>
                    </Menu.Link>
                    <Menu.Link asChild>
                      <button
                        onClick={() => logout()}
                        className={twMerge(
                          "block px-3 py-1 text-sm leading-6 text-gray-900 hover:bg-slate-50",
                        )}
                      >
                        Logout
                      </button>
                    </Menu.Link>
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
