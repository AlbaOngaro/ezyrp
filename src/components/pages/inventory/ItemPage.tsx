import { ReactElement } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { FormProvider, useForm } from "react-hook-form";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container";
import { Id } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";
import { ItemForm } from "components/organisms/item-form/ItemForm";
import { useLazyQuery } from "lib/hooks/useLazyQuery";

type Props = {
  id: Id<"items">;
};

export function ItemPage({ id }: Props) {
  const [loadItem] = useLazyQuery(api.items.get);

  const methods = useForm({
    defaultValues: async () => loadItem({ id }),
  });

  return (
    <Container as="section" className="py-10">
      <FormProvider {...methods}>
        <ItemForm disabled />
      </FormProvider>
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
      id: id as Id<"items">,
    },
  };
}

ItemPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
