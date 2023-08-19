import { BellIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import * as Menu from "@radix-ui/react-navigation-menu";
import { Trigger, Root } from "@radix-ui/react-dialog";
import { useState } from "react";

import { twMerge } from "lib/utils/twMerge";
import { Button } from "components/atoms/button/Button";
import { CreateCustomerDialog } from "components/organisms/create-customer-dialog/CreateCustomerDialog";

import { Sidebar } from "components/organisms/sidebar/Sidebar";
import { CustomersTable } from "components/organisms/customers-table/CustomersTable";

const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

export function HomePage() {
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);

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
                        Tom Cook
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

        <div className="px-12 py-8 sm:flex sm:items-center ">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold leading-6 text-gray-900">
              Customers
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the customers in your account including their name,
              email, and phone number.
            </p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Root
              open={isCreatingCustomer}
              onOpenChange={setIsCreatingCustomer}
            >
              <Trigger asChild>
                <Button size="md">Add customer</Button>
              </Trigger>

              <CreateCustomerDialog setIsOpen={setIsCreatingCustomer} />
            </Root>
          </div>
        </div>

        <CustomersTable />
      </section>
    </main>
  );
}
