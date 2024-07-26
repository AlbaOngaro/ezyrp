import { Dispatch, SetStateAction } from "react";
import { ArrowLeft, Download, Eye } from "lucide-react";
import { format } from "date-fns";
import { View } from "../types";
import { Card } from "components/atoms/card";
import { Button } from "components/atoms/button";
import { useGetStripeSubscriptionInvoices } from "hooks/useGetStripeSubscriptionInvoices";
import { Table } from "components/atoms/table";
import { Badge } from "components/atoms/badge";
import { CHF } from "lib/formatters/chf";
import { convertRemToPx } from "lib/utils/convertRemToPx";

type Props = {
  view: Extract<View, { type: "invoices-list" }>;
  setView: Dispatch<SetStateAction<View>>;
};

export function BillingInvoicesList({
  view: {
    data: { subscription_id },
  },
  setView,
}: Props) {
  const { loading, data } = useGetStripeSubscriptionInvoices({
    subscription_id,
  });

  return (
    <div>
      <Button
        variant="link"
        onClick={() =>
          setView({
            type: "overview",
          })
        }
        className="flex flex-row gap-2 p-0 h-4 mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Go back
      </Button>

      <Card className="px-4">
        <Table
          loading={loading}
          rows={(data?.data || []).map((invoice) => ({
            ...invoice,
            _id: invoice.id,
          }))}
          columns={[
            {
              id: "paid_at",
              headerName: "Date",
              field: "status_transitions",
              render: ({ status_transitions }) => {
                if (status_transitions && status_transitions?.paid_at) {
                  return format(
                    status_transitions.paid_at * 1000,
                    "dd/MM/yyyy",
                  );
                }

                return "N/A";
              },
            },
            {
              id: "amount",
              headerName: "Amount",
              field: "amount_paid",
              render: ({ amount_paid }) => CHF.format(amount_paid / 100),
            },
            {
              id: "status",
              headerName: "Status",
              field: "status",
              render: ({ status }) => <Badge size="sm">{status}</Badge>,
            },
            {
              id: "receipt",
              headerName: "Receipt",
              field: "invoice_pdf",
              width: convertRemToPx(3),
              render: ({ invoice_pdf, hosted_invoice_url }) => {
                if (!invoice_pdf || !hosted_invoice_url) {
                  return null;
                }

                return (
                  <div className="flex flex-row gap-4">
                    <a
                      href={invoice_pdf}
                      rel="noreferrer"
                      className="text-blue-500"
                      download
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <a
                      href={hosted_invoice_url}
                      rel="noreferrer"
                      className="text-blue-500"
                      target="_blank"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  </div>
                );
              },
            },
          ]}
        />
      </Card>
    </div>
  );
}
