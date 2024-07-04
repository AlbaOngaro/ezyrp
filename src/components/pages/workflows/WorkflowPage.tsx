import { ReactElement } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Heading } from "components/atoms/heading";
import { Id } from "convex/_generated/dataModel";

import { FlowEditor } from "components/organisms/flow-editor";
import { Loader } from "components/atoms/loader";
import { useQuery } from "lib/hooks/useQuery";
import { api } from "convex/_generated/api";

type Props = {
  id: Id<"workflows">;
};

export function WorkflowPage({ id }: Props) {
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
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading title={id} />
      </Container>
      <Container className="h-[calc(100vh-104px-60px)]">
        <FlowEditor workflow={workflow} mode="view" />
      </Container>
    </>
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
