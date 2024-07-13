import { ReactNode } from "react";
import { useMutation } from "convex/react";
import { formatDistance } from "date-fns";
import { Heading } from "components/atoms/heading";
import { Container } from "components/atoms/container";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { useQuery } from "lib/hooks/useQuery";
import { api } from "convex/_generated/api";
import { Button } from "components/atoms/button";
import { Card } from "components/atoms/card";
import { Table } from "components/atoms/table";
import { Dialog, DialogRoot, DialogTrigger } from "components/atoms/dialog";
import { Id } from "convex/_generated/dataModel";

export function NotificationsPage() {
  const updateNotification = useMutation(api.notifications.update);
  const deleteNotification = useMutation(api.notifications.remove);
  const { data: notifications = [] } = useQuery(api.notifications.list);

  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading title="Notifications" />

        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button
            disabled={notifications.every((notification) => notification.read)}
            variant="link"
            onClick={async () => {
              await Promise.all(
                notifications
                  .filter((notification) => !notification.read)
                  .map((notification) =>
                    updateNotification({
                      id: notification._id,
                      read: true,
                    }),
                  ),
              );
            }}
          >
            Mark all as read
          </Button>
        </div>
      </Container>

      <Container as="section">
        <Card>
          <Table
            rows={notifications}
            renderSelectedActions={(rows) => (
              <DialogRoot>
                <DialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    data-testid="notifications-table__delete-all-btn"
                  >
                    Delete all
                  </Button>
                </DialogTrigger>

                <Dialog
                  data-testid="notifications__delete-dialog"
                  overlayClassname="!ml-0"
                  title="Do you really want to delete all the selected notifications?"
                  onConfirm={() =>
                    Promise.all(
                      rows.map((row) =>
                        deleteNotification({
                          id: row._id as Id<"notifications">,
                        }),
                      ),
                    )
                  }
                  cancelButtonProps={{
                    // @ts-ignore
                    "data-testid": "notifications__delete-dialog__cancel-btn",
                  }}
                  confirmButtonProps={{
                    // @ts-ignore
                    "data-testid": "notifications__delete-dialog__confirm-btn",
                  }}
                />
              </DialogRoot>
            )}
            withMultiSelect
            columns={[
              {
                id: "title",
                field: "title",
                headerName: " ",
                render: ({ title, body }) => (
                  <p className="inline-flex flex-col">
                    <strong>{title}</strong>
                    {body}
                  </p>
                ),
              },
              {
                id: "createAt",
                field: "_creationTime",
                headerName: "Time",
                render: ({ _creationTime }) =>
                  formatDistance(new Date(_creationTime), new Date(), {
                    addSuffix: true,
                  }),
              },
            ]}
            contextMenuItems={[
              {
                type: "item",
                label: "View",
                onClick: ({ url }) => {
                  if (url) {
                    window.open(url, "_blank");
                  }
                },
              },
              {
                type: "item",
                label: "Mark as read",
                onClick: async ({ _id, read }) => {
                  if (read) return;

                  await updateNotification({
                    id: _id,
                    read: true,
                  });
                },
              },
            ]}
          />
        </Card>
      </Container>
    </>
  );
}

NotificationsPage.getLayout = function getLayout(page: ReactNode) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
