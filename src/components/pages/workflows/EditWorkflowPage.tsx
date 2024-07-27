import { ReactElement } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Id } from "convex/_generated/dataModel";

import { FlowEditor } from "components/organisms/flow-editor";
import { useQuery } from "lib/hooks/useQuery";
import { api } from "convex/_generated/api";
import { Loader } from "components/atoms/loader";
import { useProPlanDialog } from "hooks/useProPlanDialog";
import { useGetUserPlan } from "lib/hooks/useGetUserPlan";

type Props = {
  id: Id<"workflows">;
};

export function EditWorkflowPage({ id }: Props) {
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
    <Container
      className="h-[calc(100vh-60px)] p-0 lg:px-0"
      data-testid="workflow__container"
      as="section"
    >
      <FlowEditor workflow={workflow} sidebarClassName="px-8 py-4" />
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

EditWorkflowPage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
