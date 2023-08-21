import { ReactElement } from "react";

import { useProfile } from "hooks/useProfile";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { ProfileForm } from "components/organisms/profile-form/ProfileForm";

export function ProfilePage() {
  const { data } = useProfile();

  if (!data) {
    return null;
  }

  return <ProfileForm profile={data} />;
}

ProfilePage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
