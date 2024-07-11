import { usePaginatedQuery } from "convex/react";
import { useMutation } from "lib/hooks/useMutation";
import { api } from "convex/_generated/api";

type Args = {
  pageSize?: number;
};

export function useCustomers({ pageSize = 5 }: Args = {}) {
  const { results, status, loadMore } = usePaginatedQuery(
    api.customers.list,
    {},
    {
      initialNumItems: pageSize,
    },
  );

  const create = useMutation(api.customers.create);
  const update = useMutation(api.customers.update);
  const remove = useMutation(api.customers.remove);

  return {
    status,
    data: results,
    error: null,
    isLoading: status === "LoadingMore" || status === "LoadingFirstPage",
    create,
    update,
    delete: remove,
    loadMore: () => loadMore(pageSize),
  };
}
