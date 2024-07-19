import { format, isSameMonth } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CaptionProps, useNavigation } from "react-day-picker";

import { getCanGoToNextMonth } from "../helpers";
import { Button } from "components/atoms/button";

export function Caption({ displayMonth }: CaptionProps) {
  const { nextMonth, previousMonth, goToMonth, displayMonths } =
    useNavigation();

  const [left, right] = displayMonths;

  const isLeftPane = isSameMonth(left, displayMonth);
  const isRightPane = isSameMonth(right, displayMonth);

  return (
    <div className="grid grid-cols-[1.5rem_1fr_1.5rem]">
      {isLeftPane && (
        <Button
          size="icon"
          className="w-6 h-6"
          variant="ghost"
          data-testid="home__stats-range-picker--previous-month"
          onClick={() => {
            if (previousMonth) {
              goToMonth(previousMonth);
            }
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      )}
      <span className="text-center col-start-2">
        {format(displayMonth, "MMMM yyyy")}
      </span>
      {isRightPane && (
        <Button
          size="icon"
          className="w-6 h-6"
          variant="ghost"
          disabled={!nextMonth || !getCanGoToNextMonth(right)}
          data-testid="home__stats-range-picker--next-month"
          onClick={() => {
            if (nextMonth) {
              goToMonth(nextMonth);
            }
          }}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
