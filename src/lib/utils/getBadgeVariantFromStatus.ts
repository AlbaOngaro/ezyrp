import { Invoice } from "__generated__/graphql";
import { Variant } from "components/atoms/badge/Badge";

export function getBadgeVariantFromStatus(status?: Invoice["status"]): Variant {
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
