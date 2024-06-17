import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { ReactElement } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

import { useRouter } from "next/router";

import { EventTypeForm } from "components/organisms/event-type-form/EventTypeForm";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container/Container";
import { useEventTypes } from "hooks/useEventTypes";
import { Heading } from "components/atoms/heading/Heading";
import { useLazyQuery } from "lib/hooks/useLazyQuery";
import { api } from "convex/_generated/api";
import { Doc, Id } from "convex/_generated/dataModel";

type EventType = Doc<"eventTypes">;

type Props = {
  id: Id<"eventTypes">;
};

export function EditEventTypePage({ id }: Props) {
  const router = useRouter();
  const eventTypes = useEventTypes();
  const [loadEventType] = useLazyQuery(api.eventTypes.get);

  const { handleSubmit, ...methods } = useForm<EventType>({
    defaultValues: async () => {
      const data = await loadEventType({
        id,
      });

      if (!data) {
        return {
          _id: "" as Id<"eventTypes">,
          _creationTime: 0,
          description: "",
          name: "",
          variant: "",
          duration: 0,
        };
      }

      return data;
    },
  });

  const handleSubmitWrapper: UseFormHandleSubmit<EventType> = (
    onSuccess,
    onError,
  ) =>
    handleSubmit(async ({ _id, ...updateEventTypesInput }) => {
      await eventTypes.update({
        id: _id,
        ...updateEventTypesInput,
      });

      onSuccess({ _id, ...updateEventTypesInput });

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
