import { ReactElement } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Id } from "convex/_generated/dataModel";

import { FlowEditor } from "components/organisms/flow-editor";
import { Loader } from "components/atoms/loader";
import { useQuery } from "lib/hooks/useQuery";
import { api } from "convex/_generated/api";
import { useProPlanDialog } from "hooks/useProPlanDialog";
import { useGetUserPlan } from "lib/hooks/useGetUserPlan";

type Props = {
  id: Id<"workflows">;
};

export function WorkflowPage({ id }: Props) {
  useProPlanDialog();
  const plan = useGetUserPlan();

  const { data: workflow, status } = useQuery(
    api.workflows.get,
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
        There was an error loading the workflow.
      </main>
    );
  }

  return (
    <Container className="h-[calc(100vh-60px)] p-0 lg:p-0">
      <FlowEditor workflow={workflow} mode="view" />
    </Container>
  );
}

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
      id: id as Id<"workflows">,
    },
  };
}

WorkflowPage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
