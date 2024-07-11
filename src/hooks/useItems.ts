import { usePaginatedQuery } from "convex/react";
import { useMutation } from "lib/hooks/useMutation";
import { api } from "convex/_generated/api";

type Args = {
  pageSize?: number;
};

export function useItems({ pageSize = 5 }: Args = {}) {
  const { results, status, loadMore } = usePaginatedQuery(
    api.items.list,
    {},
    {
      initialNumItems: pageSize,
    },
  );
  const create = useMutation(api.items.create);
  const update = useMutation(api.items.update);
  const remove = useMutation(api.items.remove);

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
