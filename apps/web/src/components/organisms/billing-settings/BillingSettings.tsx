import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";

export function BillingSettings() {
  return (
    <Container className="grid grid-cols-[1fr_2fr] py-12 gap-x-4 max-w-none max-h-[calc(100vh_-_122px)] overflow-y-scroll">
      <Heading
        title="Billing settings"
        description="Manage your payment methods, subscriptions, and transaction history. You can update your credit card information, view past invoices, and cancel or renew subscriptions"
      />
    </Container>
  );
}
