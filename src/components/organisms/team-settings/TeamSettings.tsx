import { Root, Trigger } from "@radix-ui/react-dialog";
import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { format } from "date-fns";

import { Container } from "components/atoms/container";
import { Avatar } from "components/atoms/avatar";
import { Button } from "components/atoms/button";
import { Heading } from "components/atoms/heading";
import { Modal } from "components/atoms/modal";

import { CreateInviteForm } from "components/organisms/create-invite-form/CreateInviteForm";

export function TeamSettings() {
  const invites = [];

  const { handleSubmit, ...methods } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const handleSubmitWrapper: UseFormHandleSubmit<{ email: string }> = (
    onSucces,
    onError,
  ) =>
    handleSubmit(async (inputCreateInviteArgs) => {
      onSucces(inputCreateInviteArgs);
    }, onError);

  return (
    <Container className="grid grid-cols-[1fr_2fr] py-12 gap-x-4 max-w-none max-h-[calc(100vh_-_122px)] overflow-y-scroll">
      <Heading
        title="Team memebers"
        description="A list of all the team members who have been added to your workspace"
      />

      <ul className="flex flex-col gap-4 divide-y divide-gray-300 w-fit">
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
        {invites?.data?.map((invite) => (
          <li key={invite._id} className="flex flex-row items-start gap-4">
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
