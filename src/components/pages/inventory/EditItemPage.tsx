import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { ReactElement } from "react";
import { useRouter } from "next/router";

import { Container } from "components/atoms/container";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { ItemForm } from "components/organisms/item-form/ItemForm";

import { Heading } from "components/atoms/heading";
import { useItems } from "hooks/useItems";
import { Id } from "convex/_generated/dataModel";
import { useLazyQuery } from "lib/hooks/useLazyQuery";
import { api } from "convex/_generated/api";

type UpdateItemFn = typeof api.items.update;

type Props = {
  id: Id<"items">;
};

export function EditItemPage({ id }: Props) {
  const items = useItems();
  const router = useRouter();
  const [getItem] = useLazyQuery(api.items.get);

  const { handleSubmit, ...methods } = useForm<UpdateItemFn["_args"]>({
    defaultValues: async () => {
      const item = await getItem({
        id,
      });

      if (!item) {
        throw new Error("Item not found");
      }

      const { _id, _creationTime, price, ...rest } = item;

      return {
        ...rest,
        id: _id,
        price: price / 100,
      };
    },
  });

  const handleSubmitWrapper: UseFormHandleSubmit<UpdateItemFn["_args"]> = (
    onSuccess,
    onError,
  ) =>
    handleSubmit(async (data) => {
      await items.update(data);
      onSuccess(data);
      return router.push("/inventory");
    }, onError);

  return (
    <Container as="section" className="py-10">
      <Heading title={`Update item ${id}`} />
      <FormProvider {...methods} handleSubmit={handleSubmitWrapper}>
        <ItemForm />
      </FormProvider>
    </Container>
  );
}

EditItemPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export async function getServerSideProps({
  query,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  const id = (Array.isArray(query.id) ? query.id[0] : query.id) as Id<"items">;

  if (!id) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      id,
    },
  };
}
