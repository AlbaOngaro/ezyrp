import { useMutation } from "convex/react";
import { Descendant } from "slate";
import debounce from "debounce-promise";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export function useOnValueChange(id: Id<"emails">) {
  const updateEmail = useMutation(api.emails.update);

  return debounce(async (body: Descendant[]) => {
    try {
      await updateEmail({ id, body });
    } catch (e) {
      console.error(e);
    }
  }, 250);
}
