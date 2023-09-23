import {
  ArchiveIcon,
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EnvelopeClosedIcon,
  GearIcon,
  HomeIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { twMerge } from "../../../lib/utils/twMerge";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Customers", href: "/customers", icon: PersonIcon },
  { name: "Inventory", href: "/inventory", icon: ArchiveIcon },
  { name: "Invoices", href: "/invoices", icon: EnvelopeClosedIcon },
  { name: "Schedule", href: "/schedule", icon: CalendarIcon },
];

interface Props {
  isOpen?: boolean;
}

export function Sidebar({ isOpen: initialIsOpen }: Props) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(() => {
    if (typeof initialIsOpen !== "undefined") {
      return initialIsOpen;
    }

    return true;
  });

  useEffect(() => {
    setIsOpen((curr) => {
      if (typeof initialIsOpen !== "undefined") {
        return initialIsOpen;
      }

      return curr;
    });
  }, [initialIsOpen]);

  return (
    <aside
      className={twMerge(
        "left-0 flex grow flex-col gap-y-5 bg-orange-500 px-6 py-4 h-screen relative transition-all duration-300 w-[300px] print:hidden",
        {
          "pr-10": isOpen,
          "w-[66px]": !isOpen,
        },
      )}
    >
      <header>
        <img
          className="w-14 h-auto"
          src="https://res.cloudinary.com/dlha07ue9/image/upload/co_rgb:FFFFFF,e_colorize/assets/logo-notext.png"
          alt="NimblErp"
        />
      </header>

      <nav className="flex flex-1 flex-col ">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={twMerge(
                      "group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-orange-200",
                      {
                        "bg-orange-600 text-white":
                          router.asPath === item.href && isOpen,
                        "hover:bg-orange-600 hover:text-white": isOpen,
                        "text-[0px]": !isOpen,
                      },
                    )}
                  >
                    <item.icon
                      className={twMerge(
                        "h-4 w-4 shrink-0 text-orange-200 group-hover:text-white",
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
              className={twMerge(
                "group -mx-2 flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-orange-200",
                {
                  "hover:bg-orange-600 hover:text-white": isOpen,
                  "text-[0px]": !isOpen,
                },
              )}
            >
              <GearIcon
                className="h-4 w-4 shrink-0 text-orange-200 group-hover:text-white"
                aria-hidden="true"
              />
              Settings
            </a>
          </li>
        </ul>
      </nav>

      <button
        className="absolute bottom-4 -right-3 bg-orange-400 text-white shadow-lg p-2 rounded-full"
        onClick={() => setIsOpen((curr) => !curr)}
      >
        {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
      </button>
    </aside>
  );
}
