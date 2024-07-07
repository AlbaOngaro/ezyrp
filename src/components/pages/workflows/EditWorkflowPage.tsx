import { ReactElement } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Id } from "convex/_generated/dataModel";

import { FlowEditor } from "components/organisms/flow-editor";
import { useQuery } from "lib/hooks/useQuery";
import { api } from "convex/_generated/api";
import { Loader } from "components/atoms/loader";

type Props = {
  id: Id<"workflows">;
};

export function EditWorkflowPage({ id }: Props) {
  const { data: workflow, status } = useQuery(api.workflows.get, { id });

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
      className="h-[calc(100vh-60px)]"
      data-testid="workflow__container"
    >
      <FlowEditor workflow={workflow} />
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
