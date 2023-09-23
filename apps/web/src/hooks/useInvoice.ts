import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { INVOICE } from "../lib/queries/INVOICE";

export function useInvoice() {
  const { query } = useRouter();

  return useQuery(INVOICE, {
    skip: !query.id,
    variables: {
      id: query.id as string,
    },
  });
}
