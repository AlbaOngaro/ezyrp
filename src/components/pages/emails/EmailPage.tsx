import { ReactElement } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { EmailEditor } from "components/organisms/email-editor";
import { useQuery } from "lib/hooks/useQuery";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { Loader } from "components/atoms/loader";
import { Breadcrumb } from "components/atoms/breadcrumb";
import { useProPlanDialog } from "hooks/useProPlanDialog";
import { useGetUserPlan } from "lib/hooks/useGetUserPlan";

type Props = {
  id: Id<"emails">;
};

export function EmailPage({ id }: Props) {
  useProPlanDialog();
  const plan = useGetUserPlan();

  const { data: email, status } = useQuery(
    api.emails.get,
    !plan || plan !== "pro" ? "skip" : { id },
  );

  if (status === "pending") {
    return (
      <main className="h-screen w-screen flex justify-center items-center">
        <Loader />
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="h-screen w-screen flex justify-center items-center">
        There was an error loading the email.
      </main>
    );
  }

  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Breadcrumb />
      </Container>
      <Container
        as="section"
        className="h-[calc(100vh-3.5rem-3.5rem)] py-0 overflow-scroll"
      >
        <EmailEditor email={email} readOnly />
      </Container>
    </>
  );
}

EmailPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export async function getServerSideProps({
  query,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  const id = Array.isArray(query.id) ? query.id[0] : query.id;

  if (!id) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      id: id as Id<"emails">,
    },
  };
}
