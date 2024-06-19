import { Root, Trigger } from "@radix-ui/react-dialog";
import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { useOrganization } from "@clerk/clerk-react";

import { useState } from "react";
import { InvitationItem } from "./InvitationItem";
import { InviteMemberFormValue } from "./types";
import { Container } from "components/atoms/container";
import { Button } from "components/atoms/button";
import { Heading } from "components/atoms/heading";
import { Modal } from "components/atoms/modal";

import { CreateInviteForm } from "components/organisms/create-invite-form/CreateInviteForm";
import { Loader } from "components/atoms/loader";

export function TeamSettings() {
  const [isInviteMemberOpen, setIsInviteMemberOpen] = useState(false);
  const { isLoaded, organization, invitations } = useOrganization({
    invitations: {
      pageSize: 5,
      keepPreviousData: true,
    },
  });

  const { handleSubmit, ...methods } = useForm<InviteMemberFormValue>({
    defaultValues: {
      email: "",
      role: "",
    },
  });

  const handleSubmitWrapper: UseFormHandleSubmit<InviteMemberFormValue> = (
    onSucces,
    onError,
  ) =>
    handleSubmit(async ({ email, role }) => {
      if (!!organization) {
        try {
          await organization.inviteMember({
            emailAddress: email,
            role,
          });

          onSucces({ email, role });

          if (!!invitations && typeof invitations.revalidate === "function") {
            await invitations.revalidate();
          }
        } catch (error) {
          return;
        } finally {
          setIsInviteMemberOpen(false);
        }
      }
    }, onError);

  if (!isLoaded || !organization) {
    return (
      <main className="h-screen w-screen flex justify-center items-center">
        <Loader />
      </main>
    );
  }

  return (
    <Container className="grid grid-cols-[1fr_2fr] py-12 gap-x-4 max-w-none max-h-[calc(100vh_-_122px)] overflow-y-scroll">
      <Heading
        title="Team memebers"
        description="A list of all the team members who have been added to your workspace"
      />

      <ul className="flex flex-col gap-4 divide-y divide-gray-300 w-fit">
        <li className="flex flex-row items-start gap-4 pt-4">
          <Root open={isInviteMemberOpen}>
            <Trigger asChild>
              <Button onClick={() => setIsInviteMemberOpen(true)}>
                Invite team member
              </Button>
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

      <ul className="flex flex-col divide-y divide-gray-300 w-fit">
        {invitations?.data?.map((invite) => (
          <InvitationItem
            key={invite.id}
            invite={invite}
            revalidate={invitations.revalidate}
          />
        ))}
      </ul>
    </Container>
  );
}
