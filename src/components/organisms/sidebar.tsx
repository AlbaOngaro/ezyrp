import Link from "next/link";
import {
  Package2,
  Home,
  UserRound,
  CalendarDays,
  Mail,
  Settings,
  ReceiptText,
  Workflow,
  Bell,
} from "lucide-react";
import { useRouter } from "next/router";
import { JSXElementConstructor, useEffect } from "react";
import { toast } from "sonner";
import { useMutation } from "convex/react";

import { cn } from "lib/utils/cn";
import { Button } from "components/atoms/button";
import { useQuery } from "lib/hooks/useQuery";
import { api } from "convex/_generated/api";
import { Notification } from "components/atoms/notification";
import { Plan, useGetUserPlan } from "lib/hooks/useGetUserPlan";
import { Badge } from "components/atoms/badge";

type NavItem = {
  name: string;
  href: string;
  plans: Plan[];
  icon: JSXElementConstructor<any>;
};

const navigation = [
  { name: "Home", href: "/", icon: Home, plans: ["free", "pro"] },
  {
    name: "Customers",
    href: "/customers",
    icon: UserRound,
    plans: ["free", "pro"],
  },
  {
    name: "Inventory",
    href: "/inventory",
    icon: Package2,
    plans: ["free", "pro"],
  },
  {
    name: "Invoices",
    href: "/invoices",
    icon: ReceiptText,
    plans: ["free", "pro"],
  },
  {
    name: "Schedule",
    href: "/schedule",
    icon: CalendarDays,
    plans: ["free", "pro"],
  },
  {
    name: "Email templates",
    href: "/emails",
    icon: Mail,
    plans: ["pro"],
  },
  { name: "Workflows", href: "/workflows", icon: Workflow, plans: ["pro"] },
] satisfies NavItem[];

export function Sidebar() {
  const router = useRouter();
  const plan = useGetUserPlan();
  const updateNotification = useMutation(api.notifications.update);
  const { data: notifications = [] } = useQuery(api.notifications.search, {
    read: false,
  });

  useEffect(() => {
    notifications.map((notification) =>
      toast.message(notification.title, {
        unstyled: true,
        classNames: {
          toast:
            "bg-white w-full border border-gray-100 grid grid-cols-2 gap-y-0 px-4 py-2 rounded-md shadow-md",
          title: "col-start-1 row-start-1 text-black font-bold text-sm",
          content: "col-start-1 row-span-2 text-black",
          description: "col-start-1 row-start-2 text-black text-sm",
          actionButton:
            "text-sm col-start-2 col-end-2 row-start-1 border-none text-right bg-transparent p-0 hover:underline",
          cancelButton:
            "text-sm col-start-2 col-end-2 bg-transparent border-none text-right row-start-2 p-0 hover:underline",
        },
        id: notification._id,
        description: notification.body,
        cancel: {
          label: "Mark as read",
          onClick: () =>
            updateNotification({ id: notification._id, read: true }),
        },
        action: {
          label: "View",
          onClick: async () => {
            await updateNotification({ id: notification._id, read: true });

            if (notification.url) {
              window.open(notification.url, "_self");
            } else {
              router.push("/notifications");
            }
          },
        },
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  return (
    <aside className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <header className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <img src="/images/logo.svg" className="h-8 w-8" alt="logo" />
            <span className="">Ezyrp</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-8 w-8 relative"
            onClick={() => router.push("/notifications")}
          >
            {notifications.length > 0 && <Notification />}
            <Bell className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </header>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  {
                    "text-primary":
                      item.href === "/"
                        ? router.asPath === "/"
                        : router.asPath.startsWith(item.href),
                  },
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>

                {plan && !item.plans.includes(plan) && (
                  <Badge variant="secondary" size="sm">
                    pro
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <footer className="mt-auto px-2">
          <Link
            href="/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              {
                "text-primary": router.asPath === "/settings",
              },
            )}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </footer>
      </div>
    </aside>
  );
}
