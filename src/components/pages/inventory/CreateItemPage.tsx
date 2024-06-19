import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { ReactElement } from "react";
import { useRouter } from "next/router";
import { Container } from "components/atoms/container";
import { ItemForm } from "components/organisms/item-form/ItemForm";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { useItems } from "hooks/useItems";
import { api } from "convex/_generated/api";
import { Breadcrumb } from "components/atoms/breadcrumb";

type CreateItemFn = typeof api.items.create;

export function CreateItemPage() {
  const items = useItems();
  const router = useRouter();
  const { handleSubmit, ...methods } = useForm<CreateItemFn["_args"]>({
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      quantity: 0,
    },
  });

  const handleSubmitWrapper: UseFormHandleSubmit<CreateItemFn["_args"]> = (
    onSuccess,
    onError,
  ) =>
    handleSubmit(async (data) => {
      await items.create({
        ...data,
        price: data.price * 100,
      });
      onSuccess(data);

      return router.push("/inventory");
    }, onError);

  return (
    <Container as="section" className="py-10">
      <Breadcrumb className="mb-8" />

      <FormProvider {...methods} handleSubmit={handleSubmitWrapper}>
        <ItemForm />
      </FormProvider>
    </Container>
  );
}

CreateItemPage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
