import { useQuery } from "@apollo/client";
import { Root, Trigger } from "@radix-ui/react-dialog";
import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { format } from "date-fns";
import { InputCreateInviteArgs } from "__generated__/graphql";

import { Avatar } from "components/atoms/avatar/Avatar";
import { Button } from "components/atoms/button/Button";
import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";
import { Modal } from "components/atoms/modal/Modal";

import { useInvites } from "hooks/useInvites";
import { useUser } from "hooks/useUser";

import { USERS } from "lib/queries/USERS";
import { CreateInviteForm } from "components/organisms/create-invite-form/CreateInviteForm";

export function TeamSettings() {
  const invites = useInvites();
  const { data } = useQuery(USERS);
  const { data: currentUser } = useUser();

  const { handleSubmit, ...methods } = useForm<InputCreateInviteArgs>({
    defaultValues: {
      email: "",
    },
  });

  const handleSubmitWrapper: UseFormHandleSubmit<InputCreateInviteArgs> = (
    onSucces,
    onError,
  ) =>
    handleSubmit(async (inputCreateInviteArgs) => {
      await invites.create({
        variables: {
          createInviteArgs: [inputCreateInviteArgs],
        },
      });

      onSucces(inputCreateInviteArgs);
    }, onError);

  return (
    <Container className="grid grid-cols-[1fr_2fr] py-12 gap-x-4 max-w-none max-h-[calc(100vh_-_122px)] overflow-y-scroll">
      <Heading
        title="Team memebers"
        description="A list of all the team members who have been added to your workspace"
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
          <Root>
            <Trigger asChild>
              <Button>Invite team member</Button>
            </Trigger>

            <Modal>
              <FormProvider {...methods} handleSubmit={handleSubmitWrapper}>
                <CreateInviteForm />
              </FormProvider>
            </Modal>
          </Root>
        </li>
      </ul>

      <hr className="col-span-2 mt-4 mb-6" />

      <Heading
        title="Pending invites"
        description="A list of all the team members who have been invited to your workspace"
      />

      <ul className="flex flex-col gap-4 divide-y divide-gray-300 w-fit">
        {invites?.data?.invites?.map((invite) => (
          <li key={invite.id} className="flex flex-row items-start gap-4">
            <Avatar seed={invite.email} className="w-10 h-10" />
            <span className="flex flex-col">
              <strong>{invite.email} </strong>
              {format(
                invite.sent_at ? new Date(invite.sent_at) : new Date(),
                "dd/MM/yyyy HH:mm",
              )}
            </span>
          </li>
        ))}
      </ul>
    </Container>
  );
}
