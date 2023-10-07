import { useMutation, useQuery } from "@apollo/client";
import { CREATE_INVITES } from "lib/mutations/CREATE_INVITES";
import { INVITES } from "lib/queries/INVITES";

export function useInvites() {
  const { data, loading } = useQuery(INVITES);

  const [create] = useMutation(CREATE_INVITES, {
    refetchQueries: [INVITES],
  });

  return {
    data,
    loading,
    create,
  };
}
