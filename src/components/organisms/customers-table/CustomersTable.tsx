import {
  Root as DialogRoot,
  Trigger as DialogTrigger,
} from "@radix-ui/react-alert-dialog";
import { useMutation } from "convex/react";
import { useState } from "react";

import { format, parseISO } from "date-fns";
import { useGetContextMenuItems } from "./hooks/useGetContextMenuItems";

import { EmailFilter } from "./components/email-filter";
import { NameFilter } from "./components/name-filter";
import { Dialog } from "components/atoms/dialog";
import { Table } from "components/atoms/table";
import { Button } from "components/atoms/button";

import { Id } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";
import { Card } from "components/atoms/card";
import { usePaginatedQuery } from "lib/hooks/usePaginatedQuery";

const PAGE_SIZE = 5;

export function CustomersTable() {
  const [query, setQuery] = useState("");
  const contextMenuItems = useGetContextMenuItems();
  const deleteCustomer = useMutation(api.customers.remove);
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.customers.search,
    {
      query,
    },
    {
      initialNumItems: PAGE_SIZE,
    },
  );

  return (
    <Card>
      <Table
        data-testid="customers-table"
        loading={isLoading}
        columns={[
          {
            id: "name",
            field: "name",
            headerName: "Name",
            sortable: true,
            filterable: true,
            filterComponent: <NameFilter query={query} setQuery={setQuery} />,
            testId: "customers-table__name-column",
          },
          {
            id: "email",
            field: "email",
            headerName: "E-mail",
            filterable: true,
            filterComponent: <EmailFilter query={query} setQuery={setQuery} />,
            testId: "customers-table__email-column",
          },
          {
            id: "birthday",
            field: "birthday",
            headerName: "Birthday",
            sortable: true,
            render: ({ birthday }) => (
              <span className="text-center">
                {birthday ? format(parseISO(birthday), "dd/MM/yyyy") : "-"}
              </span>
            ),
          },
        ]}
        rows={results || []}
        withMultiSelect
        renderSelectedActions={(rows) => (
          <DialogRoot>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                data-testid="customers-table__delete-all-btn"
              >
                Delete all
              </Button>
            </DialogTrigger>

            <Dialog
              data-testid="customers__delete-dialog"
              overlayClassname="!ml-0"
              title="Do you really want to delete all the selected customers?"
              description="This action cannot be undone. All invoices linked to this customer will also be deleted."
              onConfirm={() =>
                Promise.all(
                  rows.map((row) =>
                    deleteCustomer({ id: row._id as Id<"customers"> }),
                  ),
                )
              }
              cancelButtonProps={{
                // @ts-ignore
                "data-testid": "customers__delete-dialog__cancel-btn",
              }}
              confirmButtonProps={{
                // @ts-ignore
                "data-testid": "customers__delete-dialog__confirm-btn",
              }}
            />
          </DialogRoot>
        )}
        contextMenuItems={contextMenuItems}
        pagination={{
          status,
          pageSize: PAGE_SIZE,
          loadMore: () => loadMore(PAGE_SIZE),
        }}
      />
    </Card>
  );
}
