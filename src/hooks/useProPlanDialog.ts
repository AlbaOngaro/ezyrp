import { useRouter } from "next/router";
import { useEffect } from "react";
import { useGetUserPlan } from "lib/hooks/useGetUserPlan";
import { dialogs } from "components/atoms/dialog";

export function useProPlanDialog() {
  const router = useRouter();
  const plan = useGetUserPlan();

  useEffect(() => {
    if (!!plan && plan !== "pro") {
      dialogs.info({
        title: "Upgrade to Pro",
        cancelButtonProps: { className: "hidden" },
        confirmText: "Upgrade now",
        onConfirm: () => router.push("/settings#billing"),
        description:
          "You need to be on the Pro plan to access this feature. Upgrade now to get access to all the email templates.",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plan]);
}
