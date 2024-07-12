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
import { useEffect } from "react";
import { toast } from "sonner";

import { useMutation } from "convex/react";
import { cn } from "lib/utils/cn";
import { Button } from "components/atoms/button";
import { useQuery } from "lib/hooks/useQuery";
import { api } from "convex/_generated/api";
import { Notification } from "components/atoms/notification";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Customers", href: "/customers", icon: UserRound },
  { name: "Inventory", href: "/inventory", icon: Package2 },
  { name: "Invoices", href: "/invoices", icon: ReceiptText },
  { name: "Schedule", href: "/schedule", icon: CalendarDays },
  { name: "Email templates", href: "/emails", icon: Mail },
  { name: "Workflows", href: "/workflows", icon: Workflow },
];

export function Sidebar() {
  const router = useRouter();
  const updateNotification = useMutation(api.notifications.update);
  const { data: notifications = [] } = useQuery(api.notifications.search, {
    read: false,
  });

  useEffect(() => {
    notifications.map((notification) =>
      toast.message(notification.title, {
        id: notification._id,
        description: notification.body,
        cancel: {
          label: "Mark as read",
          onClick: () =>
            updateNotification({ id: notification._id, read: true }),
        },
        action: {
          label: "View",
          onClick: () => {
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
