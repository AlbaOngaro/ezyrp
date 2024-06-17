import { Trigger, Root } from "@radix-ui/react-alert-dialog";

import { Button } from "components/atoms/button/Button";
import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";
import { ProfileForm } from "components/organisms/profile-form/ProfileForm";
import { ResetPasswordForm } from "components/organisms/reset-password-form/ResetPasswordForm";
import { Dialog } from "components/atoms/dialog/Dialog";

export function AccountSettings() {
  return (
    <Container className="grid grid-cols-[1fr_2fr] py-12 gap-x-4 max-w-none max-h-[calc(100vh_-_122px)] overflow-y-scroll">
      <Heading
        title="Personal Information"
        description="Use a permanent address where you can receive mail."
      />

      <ProfileForm className="!w-full p-0" />

      <hr className="col-span-2 mt-4 mb-6" />

      <Heading
        title="Change password"
        description="Update your password associated with your account."
      />

      <ResetPasswordForm />

      <hr className="col-span-2 mt-4 mb-6" />

      <Heading
        title="Delete account"
        description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently."
      />

      <Root>
        <Trigger asChild>
          <Button variant="danger" size="xl" className="h-fit w-fit">
            Yes, delete my account
          </Button>
        </Trigger>
        <Dialog
          title="Are you sure you want to delete all your data?"
          description="This action is not reversible!"
        />
      </Root>
    </Container>
  );
}
