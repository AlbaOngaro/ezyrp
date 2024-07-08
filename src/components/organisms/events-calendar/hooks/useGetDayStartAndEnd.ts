import { useMemo } from "react";
import { useSettings } from "hooks/useSettings";

export function useGetDayStartAndEnd() {
  const { data: settings } = useSettings();

  return useMemo(() => {
    const [startHours, startMinutes] = (settings?.start || "09:00")
      .split(":")
      .map((t) => parseInt(t, 10));
    const [endHours, endMinutes] = (settings?.end || "17:00")
      .split(":")
      .map((t) => parseInt(t, 10));

    return {
      dayStartsAt: startHours + startMinutes / 60,
      dayEndsAt: endHours + endMinutes / 60,
    };
  }, [settings?.end, settings?.start]);
}
