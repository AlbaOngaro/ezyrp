import { ReactElement } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Heading } from "components/atoms/heading";
import { Id } from "convex/_generated/dataModel";

import { FlowEditor } from "components/organisms/flow-editor";

type Props = {
  id: Id<"workflows">;
};

export function EditFlowPage({ id }: Props) {
  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading title={id} />
      </Container>
      <Container className="h-[calc(100vh-104px-60px)]">
        <FlowEditor />
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

EditFlowPage.getLayout = (page: ReactElement) => (
  <SidebarLayout>{page}</SidebarLayout>
);
