import { useMutation } from "convex/react";
import { Badge } from "components/atoms/badge";
import { Card } from "components/atoms/card";
import { Container } from "components/atoms/container";
import { Table } from "components/atoms/table";
import { api } from "convex/_generated/api";
import { useQuery } from "lib/hooks/useQuery";

export function EventsTable() {
  const { data: events = [] } = useQuery(api.events.list);

  const updateEvent = useMutation(api.events.update);

  return (
    <Container
      as="section"
      className="lg:h-[calc(100vh_-_124px)] py-10 overflow-hidden"
    >
      <Card>
        <Table
          columns={[
            {
              id: "name",
              field: "name",
              headerName: "Name",
            },
            {
              id: "start",
              field: "start",
              headerName: "Start",
              render: ({ start }) => new Date(start).toLocaleString(),
            },
            {
              id: "status",
              field: "status",
              headerName: "Status",
              render: ({ status }) => <Badge>{status}</Badge>,
            },
          ]}
          rows={events}
          withMultiSelect
          contextMenuItems={[
            {
              type: "item",
              label: "Approve",
              onClick: (event) =>
                updateEvent({
                  id: event._id,
                  status: "approved",
                }),
            },
          ]}
        />
      </Card>
    </Container>
  );
}
