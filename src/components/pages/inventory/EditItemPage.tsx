import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useLazyQuery } from "@apollo/client";
import { ReactElement } from "react";
import { useRouter } from "next/router";

import { Item } from "__generated__/graphql";

import { ITEM } from "lib/queries/ITEM";

import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";

import { ItemForm } from "components/organisms/item-form/ItemForm";

import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";
import { useItems } from "hooks/useItems";

type Props = {
  id: string;
};

export function EditItemPage({ id }: Props) {
  const items = useItems();
  const router = useRouter();
  const [getItem] = useLazyQuery(ITEM);

  const { handleSubmit, ...methods } = useForm<Item>({
    defaultValues: async () => {
      const { data } = await getItem({
        variables: {
          id,
        },
      });

      const item = data?.item as Item;

      return {
        ...item,
        price: item.price / 100,
      };
    },
  });

  const handleSubmitWrapper: UseFormHandleSubmit<Item> = (onSuccess, onError) =>
    handleSubmit(async ({ __typename, ...data }) => {
      await items.update({
        variables: {
          updateItemsInput: [
            {
              ...data,
              price: data.price * 100,
            },
          ],
        },
      });

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
  const id = Array.isArray(query.id) ? query.id[0] : query.id;

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
