import { ReactElement } from "react";
import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { EventType } from "__generated__/graphql";
import { variants } from "server/schema/event";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container/Container";
import { Heading } from "components/atoms/heading/Heading";
import { EventTypeForm } from "components/organisms/event-type-form/EventTypeForm";
import { useEventTypes } from "hooks/useEventTypes";

export function CreateEventTypePage() {
  const router = useRouter();
  const eventTypes = useEventTypes();

  const { handleSubmit, ...methods } = useForm<EventType>({
    defaultValues: {
      variant: variants[0],
      name: "",
    },
  });

  const handleSubmitWrapper: UseFormHandleSubmit<EventType> = (
    onSuccess,
    onError,
  ) =>
    handleSubmit(async (data) => {
      await eventTypes.create({
        variables: {
          createEventTypesInput: [data],
        },
      });

      onSuccess(data);

      return router.push("/schedule");
    }, onError);

  return (
    <Container as="section" className="py-10">
      <Heading title="Create a new event type" />

      <FormProvider {...methods} handleSubmit={handleSubmitWrapper}>
        <EventTypeForm className="w-1/2" />
      </FormProvider>
    </Container>
  );
}

CreateEventTypePage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};
