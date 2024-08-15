import { Plus, X } from "lucide-react";
import { Form } from "@radix-ui/react-form";
import { FormEvent, useState } from "react";
import { addDays, format } from "date-fns";
import { DateRange } from "react-day-picker";

import { api } from "convex/_generated/api";

import { useQuery } from "lib/hooks/useQuery";
import { useMutation } from "lib/hooks/useMutation";

import { Button } from "components/atoms/button";
import { Heading } from "components/atoms/heading";
import { Modal, ModalRoot } from "components/atoms/modal";
import { DateRangePicker } from "components/organisms/date-range-picker";

export function VacationsForm() {
  const [range, setRange] = useState<DateRange>({
    from: new Date(),
    to: addDays(new Date(), 14),
  });
  const [updateSettings, { loading }] = useMutation(api.settings.upsert);
  const { data: settings } = useQuery(api.settings.get);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const disabled = !range || !range.from || !range.to || !settings;

  const onSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!range || !range.from || !range.to || !settings) {
      return;
    }

    try {
      await updateSettings({
        days: settings?.days,
        vacations: [
          ...(settings?.vacations || []),
          {
            start: range.from?.toISOString(),
            end: range.to?.toISOString(),
          },
        ],
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Heading
        className="h-fit sm:flex-none mb-6"
        title="Date-specific hours"
        description="Override your availability for specific dates when your hours differ from your regular weekly hours."
      />

      <ModalRoot
        open={isModalOpen}
        onOpenChange={(state) => {
          setTimeout(() => (document.body.style.pointerEvents = ""), 150);

          if (!state) {
            setIsModalOpen(false);
          }
        }}
      >
        <Button
          variant="outline"
          className="w-fit"
          onClick={() => {
            setTimeout(() => (document.body.style.pointerEvents = ""), 0);
            setIsModalOpen(true);
          }}
        >
          Add vacation <Plus className="ml-2 w-4 h-4" />
        </Button>
        <Modal
          title="Select the date(s) you want to assign specific hours"
          closeOnClickOutside={false}
        >
          <Form className="flex flex-col gap-4 mt-6" onSubmit={onSubmitHandler}>
            <label className="flex flex-col gap-2 text-sm font-bold text-gray-800 w-full">
              Select the date range
              <DateRangePicker
                disabled={{
                  before: new Date(),
                }}
                range={range}
                onChange={(range) => {
                  if (range) {
                    setRange(range);
                  }
                }}
                fullWidth
                className="w-full"
              />
            </label>

            <Button
              className="w-[50%] ml-auto"
              loading={loading}
              disabled={disabled}
            >
              Save
            </Button>
          </Form>
        </Modal>
      </ModalRoot>

      <ul>
        {(settings?.vacations || []).map((vacation, i) => (
          <li key={i} className="flex items-center gap-2 p-2">
            {format(vacation.start, "MMM dd, yyyy")}
            <span>-</span>
            {format(vacation.end, "MMM dd, yyyy")}

            <span className="mx-auto text-sm text-muted-foreground">
              Unavailable
            </span>

            <Button
              size="icon"
              variant="ghost"
              className="ml-auto h-8 w-8"
              disabled={loading}
              onClick={async () => {
                if (!settings) {
                  return;
                }

                try {
                  await updateSettings({
                    days: settings?.days,
                    vacations: (settings?.vacations || []).filter(
                      (_, j) => j !== i,
                    ),
                  });
                } catch (error) {
                  console.error(error);
                }
              }}
            >
              <X className="w-4 h-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
