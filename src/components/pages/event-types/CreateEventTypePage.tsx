import { ReactElement } from "react";
import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useUser } from "@clerk/clerk-react";
import { Container } from "components/atoms/container";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Heading } from "components/atoms/heading";
import { EventTypeForm } from "components/organisms/event-type-form/EventTypeForm";
import { useEventTypes } from "hooks/useEventTypes";
import { api } from "convex/_generated/api";
import { VARIANTS } from "components/organisms/event-type-form/constants";
import { useGetIsAdmin } from "lib/hooks/useGetIsAdmin";

export type CreateEventTypeFn = typeof api.eventTypes.create;

export function CreateEventTypePage() {
  const router = useRouter();
  const { user } = useUser();
  const isAdmin = useGetIsAdmin();
  const eventTypes = useEventTypes();

  const { handleSubmit, ...methods } = useForm<CreateEventTypeFn["_args"]>({
    defaultValues: {
      variant: VARIANTS[0],
      name: "",
      clerk_id: isAdmin ? "" : user?.id,
    },
  });

  const handleSubmitWrapper: UseFormHandleSubmit<CreateEventTypeFn["_args"]> = (
    onSuccess,
    onError,
  ) =>
    handleSubmit(async (data) => {
      await eventTypes.create(data);

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
