import { CalendarIcon, PersonIcon } from "@radix-ui/react-icons";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { Card } from "components/atoms/card/Card";

export function SuccessView() {
  const { watch } = useFormContext();

  return (
    <div className="col-span-12 flex flex-col gap-2">
      <h1 className="text-center text-2xl mb-4">You&rsquo;re all set!</h1>
      <p className="text-center mb-2">
        A calendar invitation has been sent to your email address.
      </p>
      <Card className="w-fit mx-auto border border-gray-100">
        <span className="flex gap-2 items-center mb-2">
          <PersonIcon /> {watch("guests.0.name")}
        </span>
        <span className="flex gap-2 items-center">
          <CalendarIcon className="shrink-0" />
          {format(new Date(watch("start")), "HH:mm, EEEE, MMMM dd yyyy")}
        </span>
      </Card>
    </div>
  );
}
