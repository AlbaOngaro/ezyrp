import Link from "next/link";
import {
  Bell,
  Package2,
  Home,
  UserRound,
  CalendarDays,
  Mail,
  Settings,
} from "lucide-react";
import { Button } from "components/atoms/button";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Customers", href: "/customers", icon: UserRound },
  { name: "Inventory", href: "/inventory", icon: Package2 },
  { name: "Invoices", href: "/invoices", icon: Mail },
  { name: "Schedule", href: "/schedule", icon: CalendarDays },
];

export function Sidebar() {
  return (
    <aside className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <header className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Acme Inc</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
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
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
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
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </footer>
      </div>
    </aside>
  );
}
