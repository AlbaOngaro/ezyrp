import { Doc } from "convex/_generated/dataModel";

type Invoice = Doc<"invoices">;

export function getBadgeVariantFromStatus(status?: Invoice["status"]) {
  switch (status) {
    case "overdue":
      return "danger";
    case "paid":
      return "success";
    case "pending":
    default:
      return "info";
  }
}
