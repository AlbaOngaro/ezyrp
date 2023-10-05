import { EventSpecification } from "@trigger.dev/sdk";

export type OnRecordCreatedEvent<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  before: null;
  after: T & { id: string };
};

export function onCreate<
  T extends Record<string, unknown> = Record<string, unknown>,
>(): EventSpecification<OnRecordCreatedEvent<T>> {
  return {
    name: "record.created",
    title: "Record created",
    source: "SurrealDb",
    icon: "Surrealdb",
    examples: [
      {
        id: "asdf",
        name: "record.created",
        icon: "Surrealdb",
        payload: {
          before: null,
          after: {
            id: "event:test",
          },
        },
      },
    ],
    parsePayload: (payload) => payload as OnRecordCreatedEvent<T>,
  };
}

export type OnRecordUpdatedEvent<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  before: T & { id: string };
  after: T & { id: string };
};

export function onUpdate<
  T extends Record<string, unknown> = Record<string, unknown>,
>(): EventSpecification<OnRecordUpdatedEvent<T>> {
  return {
    name: "record.updated",
    title: "Record updated",
    source: "SurrealDb",
    icon: "Surrealdb",
    examples: [
      {
        id: "asdf",
        name: "record.updated",
        icon: "Surrealdb",
        payload: {
          before: {
            id: "event:test",
          },
          after: {
            id: "event:test",
          },
        },
      },
    ],
    parsePayload: (payload) => payload as OnRecordUpdatedEvent<T>,
  };
}

export type OnRecordDeletedEvent<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  before: T & { id: string };
  after: null;
};

export function onDelete<
  T extends Record<string, unknown> = Record<string, unknown>,
>(): EventSpecification<OnRecordDeletedEvent<T>> {
  return {
    name: "record.deleted",
    title: "Record deleted",
    source: "SurrealDb",
    icon: "Surrealdb",
    examples: [
      {
        id: "asdf",
        name: "record.deleted",
        icon: "Surrealdb",
        payload: {
          before: {
            id: "event:test",
          },
          after: null,
        },
      },
    ],
    parsePayload: (payload) => payload as OnRecordDeletedEvent<T>,
  };
}
