import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { ReactElement } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { useRouter } from "next/router";

import { Container } from "components/atoms/container";
import { EventTypeForm } from "components/organisms/event-type-form/EventTypeForm";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { useEventTypes } from "hooks/useEventTypes";
import { Heading } from "components/atoms/heading";
import { useLazyQuery } from "lib/hooks/useLazyQuery";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

type UpdateEventTypeFn = typeof api.eventTypes.update;

type Props = {
  id: Id<"eventTypes">;
};

export function EditEventTypePage({ id }: Props) {
  const router = useRouter();
  const eventTypes = useEventTypes();
  const [loadEventType] = useLazyQuery(api.eventTypes.get);

  const { handleSubmit, ...methods } = useForm<UpdateEventTypeFn["_args"]>({
    defaultValues: async () => {
      const data = await loadEventType({
        id,
      });

      if (!data) {
        throw new Error("Event type not found");
      }

      const { _id, _creationTime, workspace: _workspace, ...rest } = data;

      return {
        id: _id,
        ...rest,
      };
    },
  });

  const handleSubmitWrapper: UseFormHandleSubmit<UpdateEventTypeFn["_args"]> = (
    onSuccess,
    onError,
  ) =>
    handleSubmit(async (data) => {
      await eventTypes.update(data);
      onSuccess(data);
      router.push("/schedule");
    }, onError);

  return (
    <Container as="section" className="py-10">
      <Heading title="Edit an existing event type" />

      <FormProvider {...methods} handleSubmit={handleSubmitWrapper}>
        <EventTypeForm className="w-1/2" />
      </FormProvider>
    </Container>
  );
}

EditEventTypePage.getLayout = function getLayout(page: ReactElement) {
  return <SidebarLayout>{page}</SidebarLayout>;
};

export async function getServerSideProps({
  query,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  const id = (
    Array.isArray(query.id) ? query.id[0] : query.id
  ) as Id<"eventTypes">;

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
