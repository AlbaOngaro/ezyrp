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
} from "lucide-react";
import { useRouter } from "next/router";
import { cn } from "lib/utils/cn";

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

  return (
    <aside className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <header className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <img src="/images/logo.svg" className="h-8 w-8" alt="logo" />
            <span className="">Ezyrp</span>
          </Link>
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
