import { useQuery } from "@apollo/client";
import { Avatar } from "components/atoms/avatar/Avatar";
import { Button } from "components/atoms/button/Button";
import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";
import { useUser } from "hooks/useUser";

import { USERS } from "lib/queries/USERS";

export function TeamSettings() {
  const { data: currentUser } = useUser();
  const { data } = useQuery(USERS);

  return (
    <Container className="grid grid-cols-[1fr_2fr] py-12 gap-x-4 max-w-none max-h-[calc(100vh_-_122px)] overflow-y-scroll">
      <Heading
        title="Team memebers"
        description="A list of all the team members who have been invited to your workspace"
      />

      <ul className="flex flex-col gap-4 divide-y divide-gray-300 w-fit">
        {data?.users?.map((user) => (
          <li key={user.id} className="flex flex-row items-start gap-4">
            <Avatar
              photoUrl={user.photoUrl}
              seed={user.email}
              className="w-10 h-10"
            />
            <span className="flex flex-col">
              <strong>
                {user.username}{" "}
                {user.id === currentUser?.user.id && <small>(You)</small>}
              </strong>
              {user.email}
            </span>
          </li>
        ))}

        <li className="flex flex-row items-start gap-4 pt-4">
          <Button>Invite team member</Button>
        </li>
      </ul>
    </Container>
  );
}
