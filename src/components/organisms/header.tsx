import {
  Home,
  Menu,
  Package2,
  UserRound,
  CalendarDays,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { UserButton } from "@clerk/clerk-react";
import { Button } from "components/atoms/button";
import { Sheet, SheetContent, SheetTrigger } from "components/atoms/sheet";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Customers", href: "/customers", icon: UserRound },
  { name: "Inventory", href: "/inventory", icon: Package2 },
  { name: "Invoices", href: "/invoices", icon: Mail },
  { name: "Schedule", href: "/schedule", icon: CalendarDays },
];

export function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col">
          <nav className="grid gap-2 text-lg font-medium">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <item.icon className="h-6 w-6" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      <span className="ml-auto">
        <UserButton />
      </span>
    </header>
  );
}
