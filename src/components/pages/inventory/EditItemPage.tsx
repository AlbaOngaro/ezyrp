import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { ReactElement } from "react";
import { useRouter } from "next/router";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { ItemForm } from "components/organisms/item-form/ItemForm";

import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";
import { useItems } from "hooks/useItems";
import { Doc, Id } from "convex/_generated/dataModel";
import { useLazyQuery } from "lib/hooks/useLazyQuery";
import { api } from "convex/_generated/api";

type Item = Doc<"items">;

type Props = {
  id: Id<"items">;
};

export function EditItemPage({ id }: Props) {
  const items = useItems();
  const router = useRouter();
  const [getItem] = useLazyQuery(api.items.get);

  const { handleSubmit, ...methods } = useForm<Item>({
    defaultValues: async () => {
      const item = await getItem({
        id,
      });

      if (!item) {
        return {
          _id: "" as Id<"items">,
          _creationTime: 0,
          name: "",
          description: "",
          price: 0,
          onetime: false,
          quantity: 0,
        };
      }

      return {
        ...item,
        price: item.price / 100,
      };
    },
  });

  const handleSubmitWrapper: UseFormHandleSubmit<Item> = (onSuccess, onError) =>
    handleSubmit(async ({ _id, _creationTime, ...data }) => {
      await items.update({
        id: _id,
        ...data,
        price: data.price * 100,
      });

      onSuccess({
        _id,
        _creationTime,
        ...data,
      });

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
