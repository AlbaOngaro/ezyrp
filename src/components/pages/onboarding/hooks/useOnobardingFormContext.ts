import { useFormContext } from "react-hook-form";
import { FormValue } from "../types";

export function useOnobardingFormContext() {
  return useFormContext<FormValue>();
}
