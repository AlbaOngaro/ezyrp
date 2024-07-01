import { useMutation } from "convex/react";
import { Descendant } from "slate";
import debounce from "debounce-promise";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

type OnValueChangeOptions = { autoSave?: boolean };
type OnValueChangeArgs = [id: Id<"emails">, options?: OnValueChangeOptions];

export function useOnValueChange(
  ...[id, { autoSave = true } = {}]: OnValueChangeArgs
) {
  const updateEmail = useMutation(api.emails.update);

  return debounce(async (body: Descendant[]) => {
    console.log("root onValueChange", body);

    if (autoSave) {
      try {
        await updateEmail({ id, body });
      } catch (e) {
        console.error(e);
      }
    }
  }, 250);
}
