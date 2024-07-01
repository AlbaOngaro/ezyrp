import { ReactElement } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import ReactFlow, { Controls, Background, BackgroundVariant } from "reactflow";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Heading } from "components/atoms/heading";
import { Id } from "convex/_generated/dataModel";

import "reactflow/dist/style.css";

type Props = {
  id: Id<"workflows">;
};

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export function EditFlowPage({ id }: Props) {
  return (
    <>
      <Container as="section" className="py-10 sm:flex sm:items-center">
        <Heading title={id} />
      </Container>
      <Container className="h-[calc(100vh-104px-60px)]">
        <ReactFlow nodes={initialNodes} edges={initialEdges}>
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
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
