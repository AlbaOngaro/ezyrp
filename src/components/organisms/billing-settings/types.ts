export type ViewType = "overview" | "invoices-list";

type OverviewData = never;

type InvoicesListData = {
  subscription_id: string;
};

export type View =
  | {
      type: "overview";
      data?: OverviewData;
    }
  | {
      type: "invoices-list";
      data: InvoicesListData;
    };
