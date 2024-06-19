import { format } from "date-fns";
import { useState } from "react";
import { OrganizationInvitationResource } from "@clerk/types";

import { Avatar } from "components/atoms/avatar";
import { Button } from "components/atoms/button";

type Props = {
  invite: OrganizationInvitationResource;
  revalidate: () => Promise<void>;
};

export function InvitationItem({ invite, revalidate }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <li key={invite.id} className="flex flex-row items-start py-4 gap-4">
      <Avatar seed={invite.emailAddress} className="w-10 h-10" />
      <span className="flex flex-col">
        <strong>{invite.emailAddress} </strong>
        {format(
          invite.createdAt ? new Date(invite.createdAt) : new Date(),
          "dd/MM/yyyy HH:mm",
        )}
      </span>

      <Button
        loading={isLoading}
        size="sm"
        variant="destructive"
        className="ml-auto"
        onClick={async () => {
          try {
            setIsLoading(true);
            await invite.revoke();
            await revalidate();
          } catch (error) {
            return;
          } finally {
            setIsLoading(false);
          }
        }}
      >
        Revoke
      </Button>
    </li>
  );
}
