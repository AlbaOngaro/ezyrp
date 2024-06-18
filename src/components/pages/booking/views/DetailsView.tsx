import { useFormContext } from "react-hook-form";
import { Button } from "components/atoms/button";
import { Input } from "components/atoms/input";
import { TextArea } from "components/atoms/textarea";
import { useBookingContext } from "components/pages/booking/BookingPage";
import { View } from "components/pages/booking/types";

export function DetailsView() {
  const { setView } = useBookingContext();
  const {
    register,
    formState: { isValid, isSubmitting },
  } = useFormContext();

  return (
    <div className="col-span-8 flex flex-col gap-4">
      <Input label="Name" {...register("guests.0.name", { required: true })} />
      <Input
        label="Email"
        type="email"
        {...register("guests.0.email", { required: true })}
      />
      <TextArea label="Notes" {...register("notes")} />

      <footer className="flex flex-row gap-2">
        <Button variant="secondary" onClick={() => setView(View.Time)}>
          Back
        </Button>
        <Button disabled={!isValid} loading={isSubmitting}>
          Schedule
        </Button>
      </footer>
    </div>
  );
}
