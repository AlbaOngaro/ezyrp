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
import { cn } from "lib/utils/cn";

export function NotificationsPage() {
  const updateNotification = useMutation(api.notifications.update);
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

      <Container as="section" className="flex flex-col gap-4">
        {notifications.map((notification) => (
          <Card
            key={notification._id}
            className={cn("p-4 grid grid-cols-2", {
              "bg-gray-50": !notification.read,
            })}
          >
            <div>
              <strong>{notification.title}</strong>
              <p>{notification.body}</p>
              <small>
                {formatDistance(
                  new Date(notification._creationTime),
                  new Date(),
                )}{" "}
                ago
              </small>
            </div>
            <div className="flex flex-col justify-center items-end">
              <Button
                disabled={notification.read}
                variant="link"
                onClick={() =>
                  updateNotification({ id: notification._id, read: true })
                }
              >
                Mark as read
              </Button>
              {notification.url && (
                <Button
                  variant="link"
                  onClick={() => window.open(notification.url, "_blank")}
                >
                  View
                </Button>
              )}
            </div>
          </Card>
        ))}
      </Container>
    </>
  );
}

NotificationsPage.getLayout = function getLayout(page: ReactNode) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
