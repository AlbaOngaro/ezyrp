import { ReactElement } from "react";
import * as Tabs from "@radix-ui/react-tabs";

import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Heading } from "components/atoms/heading/Heading";
import { Container } from "components/atoms/container/Container";
import { ProfileForm } from "components/organisms/profile-form/ProfileForm";
import { useUser } from "hooks/useUser";
import { Button } from "components/atoms/button/Button";
import { USER } from "lib/queries/USER";
import { InputResetPasswordCredentials, Profile } from "__generated__/graphql";
import { useFileUpload } from "hooks/useFileUpload";
import { ResetPasswordForm } from "components/organisms/reset-password-form/ResetPasswordForm";

const nav = [
  {
    value: "account",
    label: "Account",
  },
  {
    value: "billing",
    label: "Billing",
  },
  {
    value: "teams",
    label: "Teams",
  },
];

export function SettingsPage() {
  const user = useUser();
  const router = useRouter();
  const [loadUser] = useLazyQuery(USER);
  const handleFileUpload = useFileUpload();

  const { handleSubmit: handleProfileSubmit, ...profile } = useForm<Profile>({
    defaultValues: async () => {
      const { data } = await loadUser();
      return data?.user?.profile as Profile;
    },
  });

  const { handleSubmit: handleResetPasswordSubmit, ...resetPassword } =
    useForm<InputResetPasswordCredentials>({
      defaultValues: {
        currentPassword: "",
        confirmPassword: "",
        newPassword: "",
      },
    });

  const handleProfileSubmitWrapper: UseFormHandleSubmit<Profile> = (
    onSuccess,
    onError,
  ) =>
    handleProfileSubmit(async (updateUserProfileArgs) => {
      if (
        updateUserProfileArgs.photoUrl &&
        !updateUserProfileArgs.photoUrl.startsWith("http")
      ) {
        const file = await fetch(updateUserProfileArgs.photoUrl)
          .then((res) => res.blob())
          .then(
            (blob) =>
              new File([blob], updateUserProfileArgs.name, {
                type: blob.type,
                lastModified: new Date().getTime(),
              }),
          );

        try {
          const photoUrl = await handleFileUpload(file);

          await user.update({
            variables: {
              updateUserProfileArgs: {
                ...updateUserProfileArgs,
                photoUrl,
              },
            },
          });

          onSuccess(updateUserProfileArgs);

          return;
        } catch (error: unknown) {
          throw new Error("Failed to upload image!");
        }
      }

      await user.update({
        variables: {
          updateUserProfileArgs,
        },
      });

      onSuccess(updateUserProfileArgs);
    }, onError);

  const handleResetPasswordSubmitWrapper: UseFormHandleSubmit<
    InputResetPasswordCredentials
  > = (onSuccess, onError) =>
    handleResetPasswordSubmit(async (credentials) => {
      await user.resetPassword({
        variables: {
          credentials,
        },
      });

      router.reload();

      onSuccess(credentials);
    }, onError);

  return (
    <Tabs.Root defaultValue="account">
      <Tabs.List
        asChild
        className="flex gap-x-4 overflow-x-auto py-4 px-8 border-b border-gray-200 bg-white"
      >
        <nav>
          {nav.map((item) => (
            <Tabs.Trigger
              key={item.value}
              className="data-[state='active']:text-orange-400 font-medium"
              value={item.value}
            >
              {item.label}
            </Tabs.Trigger>
          ))}
        </nav>
      </Tabs.List>

      <Tabs.Content value="account" asChild>
        <Container className="grid grid-cols-[1fr_2fr] py-12 gap-x-4 max-w-none max-h-[calc(100vh_-_122px)] overflow-y-scroll">
          <Heading
            title="Personal Information"
            description="Use a permanent address where you can receive mail."
          />

          <FormProvider {...profile} handleSubmit={handleProfileSubmitWrapper}>
            <ProfileForm className="!w-full p-0" />
          </FormProvider>

          <hr className="col-span-2 mt-4 mb-6" />

          <Heading
            title="Change password"
            description="Update your password associated with your account."
          />

          <FormProvider
            {...resetPassword}
            handleSubmit={handleResetPasswordSubmitWrapper}
          >
            <ResetPasswordForm />
          </FormProvider>

          <hr className="col-span-2 mt-4 mb-6" />

          <Heading
            title="Delete account"
            description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently."
          />

          <Button variant="danger" size="xl" className="h-fit w-fit">
            Yes, delete my account
          </Button>
        </Container>
      </Tabs.Content>
    </Tabs.Root>
  );
}

SettingsPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
