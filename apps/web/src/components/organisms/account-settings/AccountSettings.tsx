import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useLazyQuery } from "@apollo/client";
import { Button } from "components/atoms/button/Button";
import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";
import { ProfileForm } from "components/organisms/profile-form/ProfileForm";
import { ResetPasswordForm } from "components/organisms/reset-password-form/ResetPasswordForm";
import { useUser } from "hooks/useUser";
import { USER } from "lib/queries/USER";
import { useFileUpload } from "hooks/useFileUpload";
import { InputResetPasswordCredentials, Profile } from "__generated__/graphql";

export function AccountSettings() {
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
  );
}
