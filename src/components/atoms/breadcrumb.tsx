import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { useRouter } from "next/router";
import { capitalize } from "lodash";
import Link from "next/link";
import { cn } from "lib/utils/cn";

const PATH_BLACKLIST = ["edit", "create"];

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode;
  }
>((props, ref) => {
  const router = useRouter();

  return (
    <nav ref={ref} aria-label="breadcrumb" {...props}>
      <BreadcrumbList>
        {router.asPath
          .split("/")
          .filter((path) => !!path && !PATH_BLACKLIST.includes(path))
          .reduce<{ label: string; href: string; isLast: boolean }[]>(
            (acc, path, i, arr) => [
              ...acc,
              {
                label: capitalize(path),
                href: acc[i - 1] ? `${acc[i - 1].href}/${path}` : `/${path}`,
                isLast: i === arr.length - 1,
              },
            ],
            [],
          )
          .map(({ label, href, isLast }) => (
            <React.Fragment key={href}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link
                    onClick={(e) => {
                      if (isLast) {
                        e.preventDefault();
                      }
                    }}
                    className={cn({
                      "text-primary hover:cursor-default": isLast,
                    })}
                    href={href}
                  >
                    {label}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator>
                  <ChevronRight className="w-4 h-4" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
      </BreadcrumbList>
    </nav>
  );
});
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className,
    )}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li role="presentation" aria-hidden="true" className={className} {...props}>
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";

export { Breadcrumb };
