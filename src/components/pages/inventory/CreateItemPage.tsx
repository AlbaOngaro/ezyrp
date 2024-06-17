import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { ReactElement } from "react";
import { useRouter } from "next/router";
import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";
import { ItemForm } from "components/organisms/item-form/ItemForm";
import { Item } from "__generated__/graphql";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { useItems } from "hooks/useItems";

export function CreateItemPage() {
  const items = useItems();
  const router = useRouter();
  const { handleSubmit, ...methods } = useForm<Item>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      quantity: 0,
    },
  });

  const handleSubmitWrapper: UseFormHandleSubmit<Item> = (onSuccess, onError) =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleSubmit(async (data) => {
      await items.create({
        variables: {
          createItemsInput: [
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
      <Heading title="Create item" />
      <FormProvider {...methods} handleSubmit={handleSubmitWrapper}>
        <ItemForm />
      </FormProvider>
    </Container>
  );
}

CreateItemPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
