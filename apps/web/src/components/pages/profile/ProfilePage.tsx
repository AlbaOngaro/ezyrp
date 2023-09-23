import { ReactElement } from "react";

import { SidebarLayout } from "../../layouts/sidebar/SidebarLayout";

import { ProfileForm } from "../../organisms/profile-form/ProfileForm";
import { useUser } from "../../../hooks/useUser";

export function ProfilePage() {
  const { data } = useUser();

  if (!data) {
    return null;
  }

  return <ProfileForm profile={data?.user?.profile} />;
}

ProfilePage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
