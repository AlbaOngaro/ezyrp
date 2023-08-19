import {
  EnvelopeClosedIcon,
  GearIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import Link from "next/link";
import { twMerge } from "lib/utils/twMerge";

const navigation = [
  { name: "Customers", href: "/", icon: PersonIcon },
  { name: "Invoices", href: "/invoices", icon: EnvelopeClosedIcon },
];

export function Sidebar() {
  const router = useRouter();

  return (
    <aside className=" flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 py-4">
      <header>
        <img
          className="h-8 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=white"
          alt="Your Company"
        />
      </header>

      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={twMerge(
                      "group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-indigo-200 hover:text-white",
                      {
                        "bg-indigo-700 text-white": router.asPath === item.href,
                      },
                    )}
                  >
                    <item.icon
                      className={twMerge(
                        "h-4 w-4 shrink-0 text-indigo-200 group-hover:text-white",
                        {
                          "text-white": router.asPath === item.href,
                        },
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          <li className="mt-auto">
            <a
              href="#"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
            >
              <GearIcon
                className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                aria-hidden="true"
              />
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
