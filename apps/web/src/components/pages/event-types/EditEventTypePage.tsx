import { FormProvider, UseFormHandleSubmit, useForm } from "react-hook-form";
import { ReactElement } from "react";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useLazyQuery } from "@apollo/client";

import { useRouter } from "next/router";
import { EventType } from "__generated__/graphql";

import { EVENT_TYPE } from "lib/queries/EVENT_TYPE";

import { EventTypeForm } from "components/organisms/event-type-form/EventTypeForm";
import { SidebarLayout } from "components/layouts/sidebar/SidebarLayout";
import { Container } from "components/atoms/container/Container";
import { useEventTypes } from "hooks/useEventTypes";
import { Heading } from "components/atoms/heading/Heading";

type Props = {
  id: string;
};

export function EditEventTypePage({ id }: Props) {
  const router = useRouter();
  const eventTypes = useEventTypes();
  const [loadEventType] = useLazyQuery(EVENT_TYPE);

  const { handleSubmit, ...methods } = useForm<EventType>({
    defaultValues: async () => {
      const { data } = await loadEventType({
        variables: {
          id,
        },
      });

      return data?.eventType as EventType;
    },
  });

  const handleSubmitWrapper: UseFormHandleSubmit<EventType> = (
    onSuccess,
    onError,
  ) =>
    handleSubmit(async ({ __typename, ...updateEventTypesInput }) => {
      await eventTypes.update({
        variables: {
          updateEventTypesInput,
        },
      });

      onSuccess({ __typename, ...updateEventTypesInput });

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
